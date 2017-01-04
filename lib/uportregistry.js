'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Required Modules
var IPFS = require('ipfs-mini');
var bs58 = require('bs58');
var Promise = require('bluebird');
var Web3 = require('web3');

var RegistryContract = require("../build/contracts/UportRegistry.sol.js");
var DEFAULT_REGISTRY_ADDRESS = '0xb9C1598e24650437a3055F7f66AC1820c419a679';

function wrapLowLevelAPI(provider) {
  // People using one of the low level api's are likely going to be node users
  var concat = require('concat-stream');
  return {
    addJSON: function addJSON(object, cb) {
      return provider.add(new Buffer(JSON.stringify(object)), cb);
    },
    catJSON: function catJSON(hash, cb) {
      return provider.cat(hash, { buffer: true }, function (error, stream) {
        try {
          stream.pipe(concat(function (data) {
            cb(null, JSON.parse(data.toString()));
          }));
        } catch (parseError) {
          cb(parseError);
        }
      });
    }
  };
}

function configureIpfs(ipfsProv) {
  if ((typeof ipfsProv === 'undefined' ? 'undefined' : _typeof(ipfsProv)) === 'object') {
    if (typeof ipfsProv.addJSON === 'function' && typeof ipfsProv.catJSON === 'function') {
      return ipfsProv;
    } else if (typeof ipfsProv.add === 'function' && typeof ipfsProv.cat === 'function') {
      return wrapLowLevelAPI(ipfsProv);
    } else if (ipfsProv.host) {
      return new IPFS(ipfsProv);
    }
  }
  throw new Error('IPFS provider must be either an ipfs-api compliant provider or a configuration hash');
};

var UportRegistry = function () {

  /**
  *  Class constructor.
  *  Creates a new UportRegistry object. The registryAddress is an optional argument and if not specified will be at the moment set to the default ropsten network uport-registry.
  *
  *  @memberof        UportRegistry#
  *  @method          constructor
  *  @param           {Object}         settings                                                            optional settings containing web3, ipfs and registry settings
  *  @return          {Object}         self
  */
  function UportRegistry() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, UportRegistry);

    this.ipfs = configureIpfs(settings.ipfs || new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }));
    RegistryContract.setProvider(settings.web3Prov || new Web3.providers.HttpProvider('https://ropsten.infura.io/uport-registry-lib'));
    this.registryContract = RegistryContract.at(settings.registryAddress || DEFAULT_REGISTRY_ADDRESS);
  }

  /**
   *  Sets the public profile JSON object stored in IPFS for the given address.
   *
   *  @memberof         UportRegistry#
   *  @method           setAttributes
   *  @param            {Object}                          Profile object
   *  @param            {Object}                          Ethereum transaction settings
   *  @return           {Promise<TX, Error>}            A promise that returns the Ethereum Transaction
   */


  _createClass(UportRegistry, [{
    key: 'setAttributes',
    value: function setAttributes(personaInfo, txData) {
      var self = this;
      return new Promise(function (accept, reject) {
        self.ipfs.addJSON(personaInfo, function (err, result) {
          if (err !== null) {
            reject(err);return;
          }
          var ipfsHash;
          if (typeof result === 'string') {
            ipfsHash = result;
          } else {
            ipfsHash = result[0] ? result[0].Hash : result.Hash;
          }
          var ipfsHashHex = base58ToHex(ipfsHash);
          self.registryContract.setAttributes('0x' + ipfsHashHex, txData).then(function (tx) {
            accept(tx);
          }).catch(reject);
        });
      });
    }

    /**
     *  Gets the public profile JSON object stored in IPFS for the given address.
     *
     *  @memberof         UportRegistry#
     *  @method           getAttributes
     *  @return           {Promise<JSON, Error>}            A promise that returns the JSON object stored in IPFS for the given address
     */

  }, {
    key: 'getAttributes',
    value: function getAttributes(personaAddress) {
      var self = this;
      return new Promise(function (accept, reject) {
        self.registryContract.getAttributes.call(personaAddress).then(function (ipfsHashHex) {
          if (ipfsHashHex === '0x') reject(new Error('No registry value for given address'));
          var ipfsHash = hexToBase58(ipfsHashHex.slice(2));
          accept(ipfsHashHex);
          self.ipfs.catJSON(ipfsHash, function (err, personaObj) {
            if (err !== null) {
              reject(new Error('Failed to get object from IPFS'));return;
            }
            accept(personaObj);
          });
        }).catch(function () {
          reject(new Error('Failed to get value from registry'));
        });
      });
    }
  }]);

  return UportRegistry;
}();

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

module.exports = UportRegistry;