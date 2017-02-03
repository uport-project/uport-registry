// Required Modules
import IPFS from 'ipfs-mini'
import bs58 from 'bs58'
import Web3 from 'web3'
import RegistryContract from "../build/contracts/UportRegistry.sol.js"
// People using one of the low level api's are likely going to be node users
import concat from 'concat-stream'

const DEFAULT_REGISTRY_ADDRESS = '0x41566e3a081f5032bdcad470adb797635ddfe1f0';

const wrapLowLevelAPI = (provider) => {
  return {
    addJSON: (object, cb) => {
      return provider.add(new Buffer(JSON.stringify(object)), cb)
    },
    catJSON: (hash, cb) => {
      return provider.cat(hash, {buffer: true}, (error, stream) => {
        try {
          stream.pipe(concat((data) => {
            cb(null, JSON.parse(data.toString()));
          }))
        } catch (parseError) {
          cb(parseError);
        }
      })
    }
  }
}

const configureIpfs = (ipfsProv) => {
  if (typeof ipfsProv === 'object') {
    if (typeof ipfsProv.addJSON === 'function' && typeof ipfsProv.catJSON === 'function' ) {
      return ipfsProv;
    } else if (typeof ipfsProv.add === 'function' && typeof ipfsProv.cat === 'function' ) {
      return wrapLowLevelAPI(ipfsProv);
    } else if (ipfsProv.host) {
      return new IPFS(ipfsProv);
    }
  }
  throw new Error('IPFS provider must be either an ipfs-api compliant provider or a configuration hash')
};

class UportRegistry {
  constructor (settings = {}) {
    this.ipfs = configureIpfs(settings.ipfs || new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }))
    RegistryContract.setProvider(settings.web3Prov || new Web3.providers.HttpProvider('https://ropsten.infura.io/uport-registry-lib'))
    this.registryContract = RegistryContract.at(settings.registryAddress || DEFAULT_REGISTRY_ADDRESS)
  }

  //Direct access to registry
  set(registrationIdentifier, subject, value, txData) {
    return new Promise( (accept, reject) => {
      this.registryContract.set(registrationIdentifier, subject, value, txData)
      .then((tx) => {
        accept(tx);
      }).catch(reject);
    });
  }
  get(registrationIdentifier, issuer, subject) {
    return new Promise((accept, reject) => {
      this.registryContract.get.call(registrationIdentifier, issuer, subject)
      .then((hexStringFromBlockChain) => {
        accept(hexStringFromBlockChain);
      }).catch(() => {
        reject(new Error('Failed to get value from registry'))
      });
    });
  }


  //deprecated API v2
  setAttributes (personaInfo, txData) {//needs ipfs
    return new Promise( (accept, reject) => {
      this.ipfs.addJSON(personaInfo, (err, result) => {
        if (err !== null) { reject(err); return; }
        let ipfsHash;
        if (typeof result === 'string') {
          ipfsHash = result
        } else {
          ipfsHash = result[0] ? result[0].Hash : result.Hash
        }
        const ipfsHashHex = base58ToHex(ipfsHash);
        const regSafeIpfs = "0x" + ipfsHashHex.slice(4);
        this.set('uPortProfileIPFS1220', txData.from, regSafeIpfs, txData)
        .then((tx) => {
          accept(tx);
        }).catch(reject);
      });
    });
  }
  getAttributes (subject) {
    return new Promise((accept, reject) => {
      this.get('uPortProfileIPFS1220', subject, subject)
      .then((ipfsHashHex) => {
        if (ipfsHashHex === '0x') reject(new Error('No registry value for given address'))
        const ipfsHash = hexToBase58("1220" + ipfsHashHex.slice(2));
        this.ipfs.catJSON(ipfsHash, (err, personaInfo) => {
          if (err !== null) {
            reject(new Error('Failed to get object from IPFS'));
            return;
          }
          accept(personaInfo);
        });
      }).catch(() => {
        reject(new Error('Failed to get value from registry'))
      });
    });
  }

  //helper functions
  hex2a(hexString) {
    var hex = hexString.slice(2);//remove '0x'
    var str = '';
    for (var i = 0; i < hex.length; i += 2){
      var byte = parseInt(hex.substr(i, 2), 16);
      if(byte){ str += String.fromCharCode(byte); }
    }
    return str;
  }
  a2hex(str) {
    var arr = [];
    for (var i = 0, l = str.length; i < l; i ++) {
      var hex = Number(str.charCodeAt(i)).toString(16);
      arr.push(hex);
    }
    return "0x" + arr.join('');
  }
}

// These conversion functions are derived from ipfs-js, but use bs58 instead
// of similar functions in bitcore since bitcore's dependencies can cause
// problems in browsers.

const base58ToHex = (b58) => {
  const hexBuf = new Buffer(bs58.decode(b58));
  return hexBuf.toString('hex');
};

const hexToBase58 = (hexStr) => {
  const buf = new Buffer(hexStr, 'hex');
  return bs58.encode(buf);
};


module.exports = UportRegistry;
