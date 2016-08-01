// Required Modules
// NOTE: The package.json tells webpack (and similar browser tools) to replace
// ipfs-js with browser-ipfs. The packages are not identical, and we should
// probably pick one and make it work everywhere.
var ipfs       = require('ipfs-js');
var bs58 = require('bs58');
var Promise = require('bluebird');
var Pudding = require('ether-pudding');
var Web3 = require('web3');
var web3 = new Web3();
Pudding.setWeb3(web3);

var UportRegistry = require("../environments/development/contracts/UportRegistry.sol.js").load(Pudding);
UportRegistry = Pudding.whisk({binary: UportRegistry.binary, abi: UportRegistry.abi})

function setWeb3Provider(web3Prov) {
  web3.setProvider(web3Prov);
};

function setIpfsProvider(ipfsProv) {
  ipfs.setProvider(ipfsProv);
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

    ipfs.addJson(personaInfo, function(err, ipfsHash) {
      if (err !== null) { reject(err); return; }

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
      ipfs.catJson(ipfsHash, function(err, personaObj) {

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
