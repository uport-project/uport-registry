# uPort Registry

## Deployed Contracts

The registry has been deployed at the following locations:

- Ropsten Testnet: `0xb9C1598e24650437a3055F7f66AC1820c419a679`
- Mainnet: `0x022f41a91cb30d6a20ffcfde3f84be6c1fa70d60`

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
npm run test
```

### Usage

To use the library, first include it in your project:

```javascript
var UportRegistry = require("uport-registry");
var registry = new UportRegistry()
```

#### IPFS Setup

It defaults to the Infura IPFS server but you can easily set it to a local server or use another client library using setIpfsProvider

You can change the ipfs connection details by passing a configuration object containing a 

```javascript
var registry = new UportRegistry({
  ipfs: { host: '127.0.0.1', port: 5001 }
});
```

We also support a full [ipfs-js-api](https://github.com/ipfs/js-ipfs-api) compliant client:

```javascript
const ipfsApi = require('ipfs-api');
var registry = new UportRegistry({
  ipfs: ipfsAPI('localhost', '5001', {protocol: 'http'})
});
```

#### Customize Web3 Provider

By default it connects to Infura's ropsten network. But you can change it by passing in your own web3 provider.

```javascript
var Web3    = require('web3');
var registry = new UportRegistry({
  web3prov: new Web3.providers.HttpProvider('https://ropsten.infura.io/uport-registry')
});
```

### Change uport registry address

By default it uses the ropsten uport registry at `0xb9C1598e24650437a3055F7f66AC1820c419a679`. You can change this using the registryAddress setting.

```javascript
var Web3    = require('web3');
var registry = new UportRegistry({
  web3prov: new Web3.providers.HttpProvider('https://mainnet.infura.io/uport-registry'),
  registryAddress: '0x022f41a91cb30d6a20ffcfde3f84be6c1fa70d60'
});
```

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
var registryAddress = '0xb9C1598e24650437a3055F7f66AC1820c419a679'
var uportId = '0xdb24b49d8f7e47d30498ee2a846375c3ba771d3e'

registry.getAttributes(uportId).then(function (attributes)
                            {console.log(attributes)})
```
