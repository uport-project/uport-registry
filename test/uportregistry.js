const assert = require('chai').assert
const Web3 = require('web3')
const Contract = require('truffle-contract')
const startProviders = require('./providerUtil')
const RegistryContractData = require('../build/contracts/UportRegistry.json')

const web3 = new Web3()
const UportRegistry = Contract(RegistryContractData)

describe('UportRegistry contract', function () {
  console.log("warning: when these assert statements fail, they 'hang' instead of displaying an error")
  this.timeout(30000)

  let web3Prov
  let accounts

  let ipfsHash = '0x00000000000000000000000000001220aaabbbcccdddeeefff00011122233344'
  let ipfsHash2 = '0x0000000000000000000000000000000000000000000000000000000000001220'

  before((done) => {
    startProviders((err, provs) => {
      if (err) {
        throw new Error(err)
      }
      web3Prov = provs.web3Provider
      web3.setProvider(web3Prov)

      // Setup for deployment of a new uport registry
      UportRegistry.setProvider(web3Prov)

      web3.eth.getAccounts((err, accs) => {
        if (err) {
          throw new Error(err)
        }
        accounts = accs
        done()
      })
    })
  })

  it('Creates and uses registry', (done) => {
    UportRegistry.new(accounts[0], {from: accounts[0], gas: 3141592}).then((reg) => {
      reg.set('uPortProfileIPFS1220', accounts[0], ipfsHash, {from: accounts[0]}).then(() => {
        return reg.get.call('uPortProfileIPFS1220', accounts[0], accounts[0])
      }).then((returnedBytes) => {
        // console.log("assert1: ", returnedBytes, " ", ipfsHash)
        assert.strictEqual(returnedBytes, ipfsHash)
        return reg.set('uPortProfileIPFS1220', accounts[1], ipfsHash2, {from: accounts[1]})
      }).then(() => {
        return reg.get.call('uPortProfileIPFS1220', accounts[1], accounts[1])
      }).then((returnedBytes2) => {
        // console.log("assert2: ", returnedBytes2, " ", ipfsHash2)
        assert.strictEqual(returnedBytes2, ipfsHash2)
        done()
      })
    }).catch(done)
  })
})
