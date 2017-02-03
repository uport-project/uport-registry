'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // Required Modules

// People using one of the low level api's are likely going to be node users


var _ipfsMini = require('ipfs-mini');

var _ipfsMini2 = _interopRequireDefault(_ipfsMini);

var _bs = require('bs58');

var _bs2 = _interopRequireDefault(_bs);

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _UportRegistrySol = require('../build/contracts/UportRegistry.sol.js');

var _UportRegistrySol2 = _interopRequireDefault(_UportRegistrySol);

var _concatStream = require('concat-stream');

var _concatStream2 = _interopRequireDefault(_concatStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_REGISTRY_ADDRESS = '0x41566e3a081f5032bdcad470adb797635ddfe1f0';

var wrapLowLevelAPI = function wrapLowLevelAPI(provider) {
  return {
    addJSON: function addJSON(object, cb) {
      return provider.add(new Buffer(JSON.stringify(object)), cb);
    },
    catJSON: function catJSON(hash, cb) {
      return provider.cat(hash, { buffer: true }, function (error, stream) {
        try {
          stream.pipe((0, _concatStream2.default)(function (data) {
            cb(null, JSON.parse(data.toString()));
          }));
        } catch (parseError) {
          cb(parseError);
        }
      });
    }
  };
};

var configureIpfs = function configureIpfs(ipfsProv) {
  if ((typeof ipfsProv === 'undefined' ? 'undefined' : _typeof(ipfsProv)) === 'object') {
    if (typeof ipfsProv.addJSON === 'function' && typeof ipfsProv.catJSON === 'function') {
      return ipfsProv;
    } else if (typeof ipfsProv.add === 'function' && typeof ipfsProv.cat === 'function') {
      return wrapLowLevelAPI(ipfsProv);
    } else if (ipfsProv.host) {
      return new _ipfsMini2.default(ipfsProv);
    }
  }
  throw new Error('IPFS provider must be either an ipfs-api compliant provider or a configuration hash');
};

var UportRegistry = function () {
  function UportRegistry() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, UportRegistry);

    console.log("Uport Warning: This library interfaces with a new registry (which supports badges). Our mobile app and supporting infrastructure do not yet reference this contract. Lock your package to version 2 if you need to use the old registry");
    this.ipfs = configureIpfs(settings.ipfs || new _ipfsMini2.default({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }));
    _UportRegistrySol2.default.setProvider(settings.web3Prov || new _web2.default.providers.HttpProvider('https://ropsten.infura.io/uport-registry-lib'));
    this.registryContract = _UportRegistrySol2.default.at(settings.registryAddress || DEFAULT_REGISTRY_ADDRESS);
  }

  //Direct access to registry


  _createClass(UportRegistry, [{
    key: 'set',
    value: function set(registrationIdentifier, subject, value, txData) {
      var _this = this;

      return new Promise(function (accept, reject) {
        _this.registryContract.set(registrationIdentifier, subject, value, txData).then(function (tx) {
          accept(tx);
        }).catch(reject);
      });
    }
  }, {
    key: 'get',
    value: function get(registrationIdentifier, issuer, subject) {
      var _this2 = this;

      return new Promise(function (accept, reject) {
        _this2.registryContract.get.call(registrationIdentifier, issuer, subject).then(function (hexStringFromBlockChain) {
          accept(hexStringFromBlockChain);
        }).catch(function () {
          reject(new Error('Failed to get value from registry'));
        });
      });
    }

    //deprecated API v2

  }, {
    key: 'setAttributes',
    value: function setAttributes(personaInfo, txData) {
      var _this3 = this;

      //needs ipfs
      return new Promise(function (accept, reject) {
        _this3.ipfs.addJSON(personaInfo, function (err, result) {
          if (err !== null) {
            reject(err);return;
          }
          var ipfsHash = void 0;
          if (typeof result === 'string') {
            ipfsHash = result;
          } else {
            ipfsHash = result[0] ? result[0].Hash : result.Hash;
          }
          var ipfsHashHex = base58ToHex(ipfsHash);
          var regSafeIpfs = "0x" + ipfsHashHex.slice(4);
          _this3.set('uPortProfileIPFS1220', txData.from, regSafeIpfs, txData).then(function (tx) {
            accept(tx);
          }).catch(reject);
        });
      });
    }
  }, {
    key: 'getAttributes',
    value: function getAttributes(subject) {
      var _this4 = this;

      return new Promise(function (accept, reject) {
        _this4.get('uPortProfileIPFS1220', subject, subject).then(function (ipfsHashHex) {
          if (ipfsHashHex === '0x') reject(new Error('No registry value for given address'));
          var ipfsHash = hexToBase58("1220" + ipfsHashHex.slice(2));
          _this4.ipfs.catJSON(ipfsHash, function (err, personaInfo) {
            if (err !== null) {
              reject(new Error('Failed to get object from IPFS'));
              return;
            }
            accept(personaInfo);
          });
        }).catch(function () {
          reject(new Error('Failed to get value from registry'));
        });
      });
    }

    //helper functions

  }, {
    key: 'hex2a',
    value: function hex2a(hexString) {
      var hex = hexString.slice(2); //remove '0x'
      var str = '';
      for (var i = 0; i < hex.length; i += 2) {
        var byte = parseInt(hex.substr(i, 2), 16);
        if (byte) {
          str += String.fromCharCode(byte);
        }
      }
      return str;
    }
  }, {
    key: 'a2hex',
    value: function a2hex(str) {
      var arr = [];
      for (var i = 0, l = str.length; i < l; i++) {
        var hex = Number(str.charCodeAt(i)).toString(16);
        arr.push(hex);
      }
      return "0x" + arr.join('');
    }
  }]);

  return UportRegistry;
}();

// These conversion functions are derived from ipfs-js, but use bs58 instead
// of similar functions in bitcore since bitcore's dependencies can cause
// problems in browsers.

var base58ToHex = function base58ToHex(b58) {
  var hexBuf = new Buffer(_bs2.default.decode(b58));
  return hexBuf.toString('hex');
};

var hexToBase58 = function hexToBase58(hexStr) {
  var buf = new Buffer(hexStr, 'hex');
  return _bs2.default.encode(buf);
};

module.exports = UportRegistry;