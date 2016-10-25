const assert          = require('chai').assert;
const Web3            = require('web3');
const startProviders  = require('./providerUtil')
const UportRegistry   = require('../build/contracts/UportRegistry.sol.js')

const web3 = new Web3()

describe('UportRegistry contract', function () {
  this.timeout(30000)

  let web3Prov

  let ipfsHash = '0x1220aaabbbcccdddeeefff00011122233344';
  let ipfsHash2 = '0x1220';


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
      reg.setAttributes(ipfsHash, {from: accounts[0]}).then(function () {
        return reg.getAttributes.call(accounts[0]);
      }).then(function(returnedBytes) {
        assert.strictEqual(returnedBytes, ipfsHash);
        reg.setAttributes(ipfsHash2, {from: accounts[1]})
      }).then(function() {
        return reg.getAttributes.call(accounts[1]);
      }).then(function(returnedBytes2) {
        assert.strictEqual(returnedBytes2, ipfsHash2);
      done()
      })
    }).catch(done)
  })
})

