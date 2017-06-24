# uPort Registry
The uport registry is a contract which is used in the uport system to link attributes to identities. This repo contains the contract code as well as a library for interacting with the registry.

## Deployed Contracts

The registry has been deployed at the following locations:

- Ropsten Testnet: `0x41566e3a081f5032bdcad470adb797635ddfe1f0`
- Kovan:           `0x5f8e9351dc2d238fb878b6ae43aa740d62fc9758`
- Rikeby:          `0x2cc31912b2b0f3075a87b3640923d45a26cef3ee`
- Mainnet:         `0xab5c8051b9a1df1aab0149f8b0630848b7ecabf6`

## Installation
```
$ npm i --save uport-registry
```

## Using the contract
By installing this library you get access to a truffle-contract compatible json file. You can import this into your project to use the uport registry on any network it is deployed on, truffle-contract will automatically detect which network you are on.
Use the following code to get the deployed instance of the registry:
```javascript
const regsitryArtifact = require('uport-registry')
const Contract = require('truffle-contract')
const Registry = Contract(regsitryArtifact)
Registry.setProvider(web3prov)
let registry = Registry.deployed()
```

The contract has two functions `set` and `get`.

### Set
Setting a value can be done in the following way:
```javascript
let key = 'myKey'     // a string (bytes32) value used for namespacing
let subject = 0x123.. // an address, if you want to register something to
                      // your own identity you should use your own address.
let value = 'myValue' // a string (bytes32), the data you want to register.
                      // Could be an ipfs hash for example.
registry.set(key, subject, value)
```
Note that when you register something the account you send the transaction from gets set as the `issuer` of the registered data.

### Get
To get data out of the registry you can do the following:
```javascript
let key = 'myKey'     // a string (bytes32) value used for namespacing
let issuer = 0x123... // an address, the account that registered the data
let subject = 0x123.. // an address, the account that the data is registered to

registry.get.call(key, issuer, subject).then((value) => {
  // value is the registered data.
})
```
Note that if you are looking for self issued data `issuer` and `subject` will be the same address


## Development of this code base
Clone the repo and install `yarn` on your system.
run `yarn install` to install all node_modules.

### Compiling
After making changes to the contract use `yarn compile-contract` to create the json artifact.

### Running tests
```
yarn test
```
Note: The tests currently timeout instead of throwing exceptions

### Deployment
To deploy the registry we used truffle, but our deploy script has a special option in order to specify the previous version of the registry. So to deploy a new version of the registry, do the following:
```
truffle migrate --network <name of eth network> --prevAddr <address of previous registry version>
```
