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

function setAttributes(registryAddress, personaInfo, txData) {
  const data = new Buffer(JSON.stringify(personaInfo))
  return ipfs.object.put(data)
    .then((res) => {
      var reg = UportRegistry.at(registryAddress);
      return reg.setAttributes('0x' + res.multihash().toString('hex'), txData);
    });
}

function getAttributes(registryAddress, personaAddress) {
  var reg = UportRegistry.at(registryAddress);
  return reg.getAttributes.call(personaAddress)
    .then((ipfsHashHex) => {
      const ipfsHash = new Buffer(ipfsHashHex.slice(2), 'hex');
      return ipfs.object.get(ipfsHash);
    })
    .then((personaObj) => JSON.parse(personaObj.toJSON().Data));
}

module.exports.setIpfsProvider = setIpfsProvider;
module.exports.setWeb3Provider = setWeb3Provider;
module.exports.setAttributes = setAttributes;
module.exports.getAttributes = getAttributes;
