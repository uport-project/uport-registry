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
