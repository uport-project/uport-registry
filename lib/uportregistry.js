// Required Modules
// NOTE: The package.json tells webpack (and similar browser tools) to replace
// ipfs-js with browser-ipfs. The packages are not identical, and we should
// probably pick one and make it work everywhere.
var ipfs       = require('ipfs-js');
var bs58 = require('bs58');
var Promise = require('bluebird');

var Web3 = require('web3');
var web3 = new Web3();
var uportContract = '[{"constant":true,"inputs":[{"name":"personaAddress","type":"address"}],"name":"getAttributes","outputs":[{"name":"","type":"bytes"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"previousPublishedVersion","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"ipfsHash","type":"bytes"}],"name":"setAttributes","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ipfsAttributeLookup","outputs":[{"name":"","type":"bytes"}],"payable":false,"type":"function"},{"inputs":[{"name":"_previousPublishedVersion","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_sender","type":"address"},{"indexed":false,"name":"_timestamp","type":"uint256"}],"name":"AttributesSet","type":"event"}]';
uportContract = JSON.parse(uportContract);
UportRegistry = web3.eth.contract(uportContract);

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
      reg.setAttributes('0x' + ipfsHashHex, txData, function(err, tx) {
        if (err) {
          reject(err);
          return;
        }
        accept(tx);
      });
    });
  });
}
function getAttributes(registryAddress, personaAddress) {
  return new Promise(function(accept, reject) {
    var reg = UportRegistry.at(registryAddress);
    reg.getAttributes(personaAddress, function(err, ipfsHashHex) {
      if (err) {reject(err); return;}
      var ipfsHash = hexToBase58(ipfsHashHex.slice(2));
      ipfs.catJson(ipfsHash, function(err, personaObj) {
         if (err !==null) {reject(err); return};
         accept(personaObj);
      });
    });
  });
}

module.exports.setIpfsProvider = setIpfsProvider;
module.exports.setWeb3Provider = setWeb3Provider;
module.exports.setAttributes = setAttributes;
module.exports.getAttributes = getAttributes;
