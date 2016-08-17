// Required Modules
var bs58 = require('bs58');
var Promise = require('bluebird');
var Pudding = require('ether-pudding');
var Web3 = require('web3');
var web3 = new Web3();
Pudding.setWeb3(web3);


var UportRegistry = require("../environments/development/contracts/UportRegistry.sol.js").load(Pudding);
UportRegistry = Pudding.whisk({binary: UportRegistry.binary, abi: UportRegistry.abi})

let ipfs

function setWeb3Provider(web3Prov) {
  web3.setProvider(web3Prov);
};

// ipfsProv should be an instance of js-ipfs or js-ipfs-api
function setIpfsProvider(ipfsProv) {
  ipfs = ipfsProv
};

// These conversion functions are derived from ipfs-js, but use bs58 instead
// of similar functions in bitcore since bitcore's dependencies can cause
// problems in browsers.

function hexToBase58(hexStr) {
  var buf = new Buffer(hexStr, 'hex');
  return bs58.encode(buf);
};

function setAttributes(registryAddress, personaInfo, txData) {
  return ipfs.object.put(new Buffer(JSON.stringify(personaInfo)))
    .then(function(res) {
      var reg = UportRegistry.at(registryAddress);
      return reg.setAttributes('0x' + res.multihash().toString('hex'), txData);
    });
}

function getAttributes(registryAddress, personaAddress) {
  var reg = UportRegistry.at(registryAddress);
  return reg.getAttributes.call(personaAddress)
    .then( function(ipfsHashHex) {
      var ipfsHash = hexToBase58(ipfsHashHex.slice(2));
      return ipfs.object.get(ipfsHash, { enc: 'base58' })
        .then((personaObj) => JSON.parse(personaObj.toJSON().Data));
    });
}

module.exports.setIpfsProvider = setIpfsProvider;
module.exports.setWeb3Provider = setWeb3Provider;
module.exports.setAttributes = setAttributes;
module.exports.getAttributes = getAttributes;
