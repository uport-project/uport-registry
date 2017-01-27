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

var DEFAULT_REGISTRY_ADDRESS = '0xb9C1598e24650437a3055F7f66AC1820c419a679';

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

    this.ipfs = configureIpfs(settings.ipfs || new _ipfsMini2.default({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }));
    _UportRegistrySol2.default.setProvider(settings.web3Prov || new _web2.default.providers.HttpProvider('https://ropsten.infura.io/uport-registry-lib'));
    this.registryContract = _UportRegistrySol2.default.at(settings.registryAddress || DEFAULT_REGISTRY_ADDRESS);
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
      var _this = this;

      return new Promise(function (accept, reject) {
        _this.ipfs.addJSON(personaInfo, function (err, result) {
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
          _this.registryContract.setAttributes('0x' + ipfsHashHex, txData).then(function (tx) {
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
      var _this2 = this;

      return new Promise(function (accept, reject) {
        _this2.registryContract.getAttributes.call(personaAddress).then(function (ipfsHashHex) {
          if (ipfsHashHex === '0x') reject(new Error('No registry value for given address'));
          var ipfsHash = hexToBase58(ipfsHashHex.slice(2));
          _this2.ipfs.catJSON(ipfsHash, function (err, personaObj) {
            if (err !== null) {
              reject(new Error('Failed to get object from IPFS'));
              return;
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

var base58ToHex = function base58ToHex(b58) {
  var hexBuf = new Buffer(_bs2.default.decode(b58));
  return hexBuf.toString('hex');
};

var hexToBase58 = function hexToBase58(hexStr) {
  var buf = new Buffer(hexStr, 'hex');
  return _bs2.default.encode(buf);
};

module.exports = UportRegistry;