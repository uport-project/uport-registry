// Required Modules
// NOTE: The package.json tells webpack (and similar browser tools) to replace
// ipfs-js with browser-ipfs. The packages are not identical, and we should
// probably pick one and make it work everywhere.
// var ipfs = require('ipfs-api');
var bs58 = require('bs58');
var Promise = require('bluebird');
var Pudding = require('ether-pudding');
var Web3 = require('web3');
var web3 = new Web3();
Pudding.setWeb3(web3);

let ipfs

var UportRegistry = require("../environments/development/contracts/UportRegistry.sol.js").load(Pudding);
UportRegistry = Pudding.whisk({binary: UportRegistry.binary, abi: UportRegistry.abi})

function setWeb3Provider(web3Prov) {
  web3.setProvider(web3Prov);
};

function setIpfsProvider(ipfsProv) {
  ipfs = ipfsProv
  // ipfs.setProvider(ipfsProv);
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
  return ipfs.object.put(new Buffer(JSON.stringify(personaInfo)))
    .then(function(res) {
      var reg = UportRegistry.at(registryAddress);
      console.log("11", '0x' + res.multihash().toString('hex'))
      return reg.setAttributes('0x' + res.multihash().toString('hex'), txData);
    });
}

function getAttributes(registryAddress, personaAddress) {
  console.log("00", registryAddress, personaAddress)
  var reg = UportRegistry.at(registryAddress);
  console.log("----", reg)
  return reg.getAttributes.call(personaAddress)
    .then( function(ipfsHashHex) {
      console.log("22", ipfsHashHex)
      var ipfsHash = hexToBase58(ipfsHashHex.slice(2));
      console.log("33", ipfsHash)
      console.log("44", new Buffer(ipfsHashHex.slice(2), 'hex'))
      return ipfs.object.get(ipfsHash, { enc: 'base58' })
        .then((personaObj) => JSON.parse(personaObj.toJSON().Data));
    });
}

module.exports.setIpfsProvider = setIpfsProvider;
module.exports.setWeb3Provider = setWeb3Provider;
module.exports.setAttributes = setAttributes;
module.exports.getAttributes = getAttributes;
