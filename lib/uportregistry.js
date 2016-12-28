// Required Modules
// NOTE: The package.json tells webpack (and similar browser tools) to replace
// ipfs-js with browser-ipfs. The packages are not identical, and we should
// probably pick one and make it work everywhere.
var IPFS       = require('ipfs-mini');
var bs58 = require('bs58');
var Promise = require('bluebird');
var Web3 = require('web3');
var web3 = new Web3();
var ipfs;

function wrapLowLevelAPI (provider) {
  // People using one of the low level api's are likely going to be node users
  const concat = require('concat-stream')
  return {
    addJSON: function (object, cb) {
      return provider.add(new Buffer(JSON.stringify(object)), cb)
    },
    catJSON: function (hash, cb) {
      return provider.cat(hash, {buffer: true}, function(error, stream) {
        try {
          stream.pipe(concat(function (data) {
            cb(null, JSON.parse(data.toString()));
          }))
        } catch (parseError) {
          cb(parseError);
        }
      })
    }
  }
}

function setIpfsProvider(ipfsProv) {
  if (typeof ipfsProv === 'object') {
    if (typeof ipfsProv.addJSON === 'function' && typeof ipfsProv.catJSON === 'function' ) {
      ipfs = ipfsProv;
      return;    
    } else if (typeof ipfsProv.add === 'function' && typeof ipfsProv.cat === 'function' ) {
      ipfs = wrapLowLevelAPI(ipfsProv);
      return;
    } else if (ipfsProv.host) {
      ipfs = new IPFS(ipfs);
      return;
    }
  }
  throw new Error('IPFS provider must be either an ipfs-api compliant provider or a configuration hash')
};

// Default to infura ipfs
setIpfsProvider(new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }));

var UportRegistry = require("../build/contracts/UportRegistry.sol.js");

function setWeb3Provider(web3Prov) {
  web3.setProvider(web3Prov);
  UportRegistry.setProvider(web3Prov);
};

// These conversion functions are derived from ipfs-js, but use bs58 instead
// of similar functions in bitcore since bitcore's dependencies can cause
// problems in browsers.

function base58ToHex(b58) {
  var hexBuf = new Buffer(bs58.decode(b58));
  return hexBuf.toString('hex');
};

function hexToBase58(hexStr) {
  var buf = new Buffer(hexStr, 'hex');
  return bs58.encode(buf);
};

function setAttributes(registryAddress, personaInfo, txData) {

  return new Promise( function(accept, reject) {
    ipfs.addJSON(personaInfo, function(err, result) {
      if (err !== null) { reject(err); return; }
      var ipfsHash;
      if (typeof result === 'string') {
        ipfsHash = result
      } else {
        ipfsHash = result[0] ? result[0].Hash : result.Hash
      }
      var ipfsHashHex = base58ToHex(ipfsHash);
      var reg = UportRegistry.at(registryAddress);
      reg.setAttributes('0x' + ipfsHashHex, txData).then(function (tx) {
        accept(tx);
      }).catch(reject);
    });

  });

}

function getAttributes(registryAddress, personaAddress) {

  return new Promise( function(accept, reject) {

    var reg = UportRegistry.at(registryAddress);
    reg.getAttributes.call(personaAddress).then( function(ipfsHashHex) {
      var ipfsHash = hexToBase58(ipfsHashHex.slice(2));
      ipfs.catJSON(ipfsHash, function(err, personaObj) {
        if (err !== null) { reject(err); return; }
        accept(personaObj);
      });
    }).catch(reject);

  });

}

module.exports.setIpfsProvider = setIpfsProvider;
module.exports.setWeb3Provider = setWeb3Provider;
module.exports.setAttributes = setAttributes;
module.exports.getAttributes = getAttributes;
module.exports.ipfsProvider = ipfs