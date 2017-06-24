# Release Notes #

## Version 5.1.0 - 2017-06-24
* Deployed the registry to the Rinkeby testnet.

## Version 5.0.0 - 2017-04-08

* Removed the javascript library. This repo now only provides the contract itself and a truffle artifact with ABI + network information

## Version 4.0.1 - 2017-02-03

* Added warnings in the readme that our mobile uport app and infrastructure will not support this registry yet. added a tag to the commit that does work with out mobile app. console log from the constructor of the same. we will depricate the npm package so npm installers using it get a message.

## Version 4.0.0 - 2017-02-03

* API/interface for the full mapping structure. This supports badges and arbitrary attestations. Changed the name of attestor/attestee to issuer/subject. Added a updatedAt field to the ethereum event. Redeployed 'version 3' to ropsten and mainnet.

## Version 3.0.0 - 2017-02-01

* Deployed the new registry contract which has support for badges. Same interface for the setAttributes right now.

## Version 2.0.6 - 2017-01-09

* Fixed a bug which caused the `getAttributes()` function to return the IPFS hash rather than the JSON object.

## Version 2.0.0 - 2016-12-30

*BREAKING CHANGE*

* You now need to instantiate a registry with it's settings.

## Version 1.3.0 - 2016-12-28

* Use ipfs-mini as default
* Ropsten support
* Clean up dependencies

## Version 1.2.5 - 2016-09-14 ##

* Add `LICENSE.md`.

## Version 1.2.4 - 2016-09-14 ##

* Fix Base58 utils.
* Add mainnet contract address to README.
* Thanks to [niran](https://github.com/niran) for the above.

## Version 1.2.3 - 2016-06-20 ##

* Remove es6 syntax from source file & skip babelify.

## Version 1.2.2 - 2016-06-17 ##

* Built dist file.

## Version 1.2.1 - 2016-06-16 ##

* Pinned `ether-pudding` to version 2.x to avoid incompatibility between `truffle` and `ether-pudding`.

## Version 1.2.0 - 2016-04-15 ##

* Update to use `browser-ipfs` when running in the browser. Thanks to [pelle](https://github.com/pelle).

## Version 1.1.0 - 2016-04-08 ##

* Add Solidity Event when adding attributes. Thanks to [SilentCicero](https://github.com/SilentCicero).

## Version 1.0.1 - 2016-03-29 ##

* Add browserified distributable

* Add deploy script and config file.

## Version 1.0.0 - 2016-03-29 ##

* Initial commit
