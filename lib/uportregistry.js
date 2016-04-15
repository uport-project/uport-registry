// Required Modules
var ipfs       = require('ipfs-js');
var base58 = require('bs58')
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

base58ToHex = ipfs.utils ? ipfs.utils.base58ToHex : function(b58) {
  var hexBuf = base58.decode(b58);
  return hexBuf.toString('hex');
};

hexToBase58 = ipfs.utils ? ipfs.utils.hexToBase58 : function(hexStr) {
  var buf = new Buffer(hexStr, 'hex');
  return base58.encode(buf);
};

function setAttributes(registryAddress, personaInfo, txData) {

  return new Promise( (accept, reject) => {

    ipfs.addJson(personaInfo, (err, ipfsHash) => {
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

  return new Promise( (accept, reject) => {

    var reg = UportRegistry.at(registryAddress);
    reg.getAttributes.call(personaAddress).then( (ipfsHashHex) => {
      var ipfsHash = hexToBase58(ipfsHashHex.slice(2));
      ipfs.catJson(ipfsHash, (err, personaObj) => {

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
