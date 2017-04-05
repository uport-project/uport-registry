# uPort Registry
The uport registry is a contract which is used in the uport system to link attributes to identities. This repo contains the contract code as well as a library for interacting with the registry.

## Deployed Contracts

The registry has been deployed at the following locations:

- Ropsten Testnet: `0x41566e3a081f5032bdcad470adb797635ddfe1f0`
- Mainnet: `0xab5c8051b9a1df1aab0149f8b0630848b7ecabf6`


### Using the contract
By installing this library you get access to a truffle-contract compatible json file. You can import this into your project to use the uport registry on any network it is deployed on, truffle-contract will automatically detect which network you are on.
Use the following code to get the deployed uport registry:
```javascript
const regsitryContract = require('uport-registry')
const Contract = require('truffle-contract')
const Registry = Contract(regsitryContract)
Registry.setProvider(web3prov)
let registry = Registry.deployed()
```

### Development of this code base
Clone the repo and install `yarn` on your system.
run `yarn install` to install all node_modules.

After making changes to the contract use `yarn compile-contract` to create the json file with the contract data that can be used with `truffle-contract`.

### Running tests

```
yarn test
```
Note: The tests currently timeout instead of throwing exceptions

### Deployment
To deploy the registry we used truffle, but our deploy script has a special option in order to specify the previous version of the registry. So to deploy do the following:
```
truffle migrate --network <name of eth network> --prevAddr <address of previous registry version>
```
