const assert = require('chai').assert
const Web3 = require('web3')
const Contract = require('truffle-contract')
const startProviders = require('./providerUtil')
const RegistryContractData = require('../build/contracts/UportRegistry.json')

const web3 = new Web3()
const UportRegistry = Contract(RegistryContractData)

describe('UportRegistry contract', function () {
  let web3Prov
  let accounts
  let registry

  let data1 = '0x00000000000000000000000000001220aaabbbcccdddeeefff00011122233344'
  let data2 = '0x0000000000000000000000000000000000000000000000000000000000001220'
  let data3 = '0xaaab000000000000000000000000000000000000000000000000000000001220'
  let data4 = '0x00000bbcc0000000000000000000000000000000000000000000000000001220'

  before(done => {
    startProviders((err, provs) => {
      if (err) throw new Error(err)
      web3Prov = provs.web3Provider
      web3.setProvider(web3Prov)
      // Setup for deployment of a new uport registry
      UportRegistry.setProvider(web3Prov)

      web3.eth.getAccounts((err, accs) => {
        if (err) throw new Error(err)
        accounts = accs
        done()
      })
    })
  })

  it('Creates registry correctly', done => {
    let fakePrevVersion = accounts[3]
    UportRegistry.new(fakePrevVersion, {from: accounts[0], gas: 3141592}).then(reg => {
      registry = reg
      return registry.version()
    }).then(version => {
      assert.equal(version.toNumber(), 3)
      return registry.previousPublishedVersion()
    }).then(previousVersion => {
      assert.equal(previousVersion, fakePrevVersion)
      done()
    }).catch(done)
  })

  it('Sets data correctly', done => {
    registry.set('key1', accounts[0], data1, {from: accounts[0]}).then(() => {
      return registry.get.call('key1', accounts[0], accounts[0])
    }).then(returnedBytes => {
      assert.strictEqual(returnedBytes, data1, 'should set data')
      return registry.set('key2', accounts[0], data2, {from: accounts[0]})
    }).then(() => {
      return registry.get.call('key2', accounts[0], accounts[0])
    }).then(returnedBytes => {
      assert.strictEqual(returnedBytes, data2, 'should set data')
      return registry.get.call('key1', accounts[0], accounts[0])
    }).then(returnedBytes => {
      assert.strictEqual(returnedBytes, data1, 'setting data on one key should not affect other keys')
      return registry.set('key3', accounts[0], data3, {from: accounts[1]})
    }).then(() => {
      return registry.get.call('key3', accounts[1], accounts[0])
    }).then(returnedBytes => {
      assert.strictEqual(returnedBytes, data3, 'should set data')
      done()
    }).catch(done)
  })

  it('Should update data correctly', done => {
    registry.set('key1', accounts[0], data4, {from: accounts[0]}).then(() => {
      return registry.get.call('key1', accounts[0], accounts[0])
    }).then(returnedBytes => {
      assert.strictEqual(returnedBytes, data4, 'should update data')
      done()
    }).catch(done)
  })
})
