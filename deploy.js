// Deploying a new PersonaRegistry
//
// Usage:
// * modify app/javascripts/config.js so that selection
//   is your target.
// * node app/javascripts/deploy.js 0xaabbbcc
//   where 0xaabbbcc is the address of the previous version
//   of PersonaRegistry

// Node modules
var Web3 = require('web3')
var fs = require('fs')

// Data / Registries / Contracts
var config = require('./config.json')
console.log(config)

// Web3 Instance
var web3 = new Web3()

// CLI Args
var prevRegistryAddr = process.argv[2]
var host = config[config['selection']].web3Host
var web3port = 8545
console.log(host)

// Set Defaults
if (host === undefined) { host = 'localhost' }
if (web3port === undefined) { web3port = '8545' }

// Make Providers
var web3prov = new web3.providers.HttpProvider('http://' + host + ':' + web3port)

const UportRegistry = require('./build/contracts/UportRegistry.sol.js')

// Set Providers
web3.setProvider(web3prov)
UportRegistry.setProvider(web3prov)

// Create new Persona Registry
web3.eth.getAccounts(function (err, acct) {
  if (err) throw new Error(err)

  console.log('prev reg: ' + prevRegistryAddr)
  if (prevRegistryAddr === undefined) {
    prevRegistryAddr = '0x0000000000000000000000000000000000000000'
  }

  UportRegistry.new(prevRegistryAddr, {from: acct[0], gas: 500000, gasPrice: 100000000000000})
    .then(function (uportReg) {
      config[config['selection']].uportRegistry = uportReg.address
      var output = JSON.stringify(config, null, 2) + '\n'
      fs.writeFile('./config.json', output)
      console.log('UportRegistry: ' + uportReg.address)
    })
})
