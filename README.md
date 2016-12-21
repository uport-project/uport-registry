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

The uPort Registry Library allows you to set attributes of and/or view attributes of uPort identities in your Dapp. You need to set a web3 provider using `uPortRegistry.setWeb3Provider` in order to access the Ethereum contracts, and you need to set an Ipfs provider using `uPortRegistry.setIpfsProvider` to access data stored in IPFS.

### Running tests

Remember to have a local IPFS node and Ethereum node running.

```
npm run test
```

### Usage

To use the library, first include it in your project:

**Node** 


```javascript
var uportRegistry = require("uport-registry");
```

Then, setup your `uportRegistry` object using the code
below. IMPORTANT: if you are using this module for the browser, you
should configure you `uportRegistry` object differently (see code
below for Browser).

```javascript
var ipfsApi = require('ipfs-api');
var web3    = require('web3');

uportRegistry.setIpfsProvider(ipfsApi(<hostname>, <port>));
uportRegistry.setWeb3Provider(new web3.providers.HttpProvider('http://localhost:8545'));
```

**Browser**

```html
<!-- uportRegistry library. -->
<script type="text/javascript" src="./dist/uportregistry.js"></script>
```

Configure your uportRegistry object using the code below. IMPORTANT:
This code is only valid if you will use it on Browsers (see above).

```javascript
uportRegistry.setIpfsProvider({host: <hostname>, port: <port>});
uportRegistry.setWeb3Provider(new web3.providers.HttpProvider('http://localhost:8545'));
```

### Setting uportRegistry Attributes

```javascript

var registryAddress = '0xbf014c4d7697cd83c9451a93648773cf510dc766'
var attributes =
{
   "@context": "http://schema.org",
   "@type": "Person",
   "name": "Christian Lundkvist",
   "image": [{"@type": "ImageObject",
             "name": "avatar",
             "contentUrl" : "/ipfs/QmUSBKeGYPmeHmLDAEHknAm5mFEvPhy2ekJc6sJwtrQ6nk"}]
}

uPortRegistry.setAttributes(registryAddress,
                            attributes,
                            {from: myAddr}
                            ).then(function ()
                            {console.log('Attributes set.')})
```

### Getting attributes

If you have an address of the current uPort identity, you can get their associated attributes using the command `uPortRegistry.getAttributes()`. This command looks up the attributes and returns a JSON structure.

```javascript
var registryAddress = '0xbf014c4d7697cd83c9451a93648773cf510dc766'
var uportId = '0xdb24b49d8f7e47d30498ee2a846375c3ba771d3e'

uPortRegistry.getAttributes(registryAddress,
                            uportId
                            ).then(function (attributes)
                            {console.log(attributes)})
```
