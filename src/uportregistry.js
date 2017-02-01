// Required Modules
import IPFS from 'ipfs-mini'
import bs58 from 'bs58'
import Web3 from 'web3'
import RegistryContract from "../build/contracts/UportRegistry.sol.js"
// People using one of the low level api's are likely going to be node users
import concat from 'concat-stream'

const DEFAULT_REGISTRY_ADDRESS = '0xb9C1598e24650437a3055F7f66AC1820c419a679';

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

  /**
  *  Class constructor.
  *  Creates a new UportRegistry object. The registryAddress is an optional argument and if not specified will be at the moment set to the default ropsten network uport-registry.
  *
  *  @memberof        UportRegistry#
  *  @method          constructor
  *  @param           {Object}         settings                                                            optional settings containing web3, ipfs and registry settings
  *  @return          {Object}         self
  */
  constructor (settings = {}) {
    this.ipfs = configureIpfs(settings.ipfs || new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }))
    RegistryContract.setProvider(settings.web3Prov || new Web3.providers.HttpProvider('https://ropsten.infura.io/uport-registry-lib'))
    this.registryContract = RegistryContract.at(settings.registryAddress || DEFAULT_REGISTRY_ADDRESS)
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
  setAttributes (personaInfo, txData) {
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
        const RegSafeIpfs = "0x" + ipfsHashHex.slice(4);
        this.registryContract.set('uPortProfileIPFS1220', txData.from, RegSafeIpfs, txData)
          .then((tx) => {
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
  getAttributes (personaAddress) {
    return new Promise((accept, reject) => {
      this.registryContract.get.call('uPortProfileIPFS1220', personaAddress, personaAddress)
        .then((ipfsHashHex) => {
          if (ipfsHashHex === '0x') reject(new Error('No registry value for given address'))
          const ipfsHash = hexToBase58("1220" + ipfsHashHex.slice(2));
          this.ipfs.catJSON(ipfsHash, (err, personaObj) => {
            if (err !== null) {
              reject(new Error('Failed to get object from IPFS'));
              return;
            }
            accept(personaObj);
          });
        }).catch(() => {
          reject(new Error('Failed to get value from registry'))
        });
    });
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
