const assert = require('chai').assert
const Web3 = require('web3')
const Contract = require('truffle-contract')
const UportRegistry = require('../src/uportregistry.js')
const startProviders = require('./providerUtil')
const RegistryContractData = require('../build/contracts/UportRegistry.json')
const personaInfo = require('./persona_example.json')
// const appData = require('./app_data.json')

const web3 = new Web3()
const RegistryContract = Contract(RegistryContractData)

describe('Higher-level uportReg APIs', function () {
  this.timeout(30000)

  let registry
  let accounts

  before((done) => {
    startProviders((err, provs) => {
      if (err) {
        throw new Error(err)
      }
      web3.setProvider(provs.web3Provider)
      web3.eth.getAccounts((err, accs) => {
        if (err) {
          throw new Error(err)
        }
        accounts = accs
        // Setup for deployment of a new uport registry
        RegistryContract.setProvider(provs.web3Provider)
        console.log('new contract')
        RegistryContract.new(accounts[0], {from: accounts[0], gas: 3141592}).then((reg) => {
          registry = new UportRegistry({
            registryAddress: reg.address,
            ipfs: provs.ipfsProv,
            web3Prov: provs.web3Provider
          })
          done()
        })
      })
    })
  })

  it('Creates personas and reads selfSignedAttributes', (done) => {
    var promises = [registry.setAttributes(personaInfo.kobe, {from: accounts[0]}),
      registry.setAttributes(personaInfo.lebron, {from: accounts[1]}),
      registry.setAttributes(personaInfo.shaq, {from: accounts[2]})]

    Promise.all(promises).then(() => {
      // Check that we can recover the Persona info
      var promises = [registry.getAttributes(accounts[0]),
        registry.getAttributes(accounts[1]),
        registry.getAttributes(accounts[2])]

      return Promise.all(promises)
    }).then((returnedPersonaInfo) => {
      // console.log(returnedPersonaInfo[0].name, 'Kobe Bryant')
      // console.log(returnedPersonaInfo[1].name, 'Lebron James')
      // console.log(returnedPersonaInfo[2].name, 'Shaquille O'Neal')

      assert.strictEqual(returnedPersonaInfo[0].name, 'Kobe Bryant')
      assert.strictEqual(returnedPersonaInfo[1].name, 'Lebron James')
      assert.strictEqual(returnedPersonaInfo[2].name, 'Shaquille O\'Neal')
      done()
    }).catch(done)
  })

  it('Creates and reads arbitrary badges', (done) => {
    var addressToBadgeDoc1 = '0x000000000000000000000000000000001111111111111111aaaaaaaaaaaaaaaa'
    var addressToBadgeDoc2 = '0x000000000000000000000000000000002222222222222222bbbbbbbbbbbbbbbb'
    var badgeNameString = 'Is Awesome'
    var boolFalse = '0x0000000000000000000000000000000000000000000000000000000000000000'
    var boolTrue = '0x0000000000000000000000000000000000000000000000000000000000000001'

    var promises = [registry.set(addressToBadgeDoc1, accounts[5], boolTrue, {from: accounts[0]}),
      registry.set(addressToBadgeDoc2, accounts[6], boolFalse, {from: accounts[1]}),
      registry.set(badgeNameString, accounts[7], 'stringVal', {from: accounts[2]})]

    Promise.all(promises).then(() => {
      var promises = [registry.get(addressToBadgeDoc1, accounts[0], accounts[5]),
        registry.get(addressToBadgeDoc1, accounts[1], accounts[6]),
        registry.get(badgeNameString, accounts[2], accounts[7])]

      return Promise.all(promises)
    }).then((returnedFromBlockChain) => {
      // console.log(returnedFromBlockChain[0])
      // console.log(returnedFromBlockChain[1])
      // console.log(registry.stringify(returnedFromBlockChain[2]))

      assert.strictEqual(returnedFromBlockChain[0], boolTrue)
      assert.strictEqual(returnedFromBlockChain[1], boolFalse)
      assert.strictEqual(registry.hex2a(returnedFromBlockChain[2]), 'stringVal')
      done()
    }).catch(done)
  })
})
