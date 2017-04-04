# uPort Registry
The uport registry is a contract which is used in the uport system to link attributes to identities. This repo contains the contract code as well as a library for interacting with the registry.

## Deployed Contracts

The registry has been deployed at the following locations:

- Ropsten Testnet: `0x41566e3a081f5032bdcad470adb797635ddfe1f0`
- Mainnet: `0xab5c8051b9a1df1aab0149f8b0630848b7ecabf6`

## About

The uPort registry library lets you set the attributes of a uPort identity. The attributes needs to be in a JSON format. Right now we are focusing on

* Full Name
* Profile Picture

but we intend to support the full [Schema.org Person schema](http://schema.org/Person). The Full Name and Profile Picture is stored in IPFS as a JSON structure that corresponds to the schema.org schema:

```
{
   "@context": "http://schema.org/",
   "@type": "Person",
   "name": "Christian Lundkvist",
   "image": [{"@type": "ImageObject",
             "name": "avatar",
             "contentUrl" : "/ipfs/QmUSBKeGYPmeHmLDAEHknAm5mFEvPhy2ekJc6sJwtrQ6nk"}]
}
```

and an IPFS hash of this structure is stored in the contract as a `bytes` structure.

## uPort Registry Library

The uPort Registry Library allows you to set attributes of and/or view attributes of uPort identities in your Dapp. 

### Running tests

```
yarn test
```
Note: The tests currently timeout instead of throwing exceptions

### Development of this code base

After making changes to `contracts/` use `yarn compile-contract` to create the json file with the contract data that can be used with `truffle-contract`. After making changes to `src/`, build with `npm run build` to create the `dist/uportregistry.js` file.

### Usage

To use the library, first include it in your project:

```javascript
const UportRegistry = require("uport-registry");
let registry = new UportRegistry()
```

#### Custom options

If you don't want to default to the Infura servers for ipfs and web3 provider you can specify this in the opts object of the Registry constructor. You can also specify another deployed version of the Registry.
```javascript
let opts = {}
opts.ipfs = { host: '127.0.0.1', port: 5001 } // you can also plug in a working ipfs object.
opts.web3prov = new Web3.providers.HttpProvider('https://localhost:8545')
opts.registryAddress = '0xADD4E55'

let registry = new UportRegistry(opts);
```
For now the default registryAddress is the one deployed on ropsten at `0x41566e3a081f5032bdcad470adb797635ddfe1f0`.

### Setting uportRegistry Attributes

```javascript

var attributes =
{
   "@context": "http://schema.org",
   "@type": "Person",
   "name": "Christian Lundkvist",
   "image": [{"@type": "ImageObject",
             "name": "avatar",
             "contentUrl" : "/ipfs/QmUSBKeGYPmeHmLDAEHknAm5mFEvPhy2ekJc6sJwtrQ6nk"}]
}

registry.setAttributes( attributes,
                        {from: myAddr}
                      ).then(function ()
                            {console.log('Attributes set.')})
```

### Getting attributes

If you have an address of the current uPort identity, you can get their associated attributes using the command `uPortRegistry.getAttributes()`. This command looks up the attributes and returns a JSON structure.

```javascript
var registryAddress = '0x41566e3a081f5032bdcad470adb797635ddfe1f0'
var uportId = '0xdb24b49d8f7e47d30498ee2a846375c3ba771d3e'

registry.getAttributes(uportId).then(function (attributes)
                            {console.log(attributes)})
```

### Using the contract directly
If you only want access to the registry contract without the library you can require the contract json and use truffle-contract.
```javascript
const regContractData = require('uport-contracts/build/contracts/UportRegistry.json')
const Contract = require('truffle-contract')
const RegistryContract = Contract(regContractData)
RegistryContract.setProvider(web3prov)
```
