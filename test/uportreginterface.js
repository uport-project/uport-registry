const assert          = require('chai').assert;
const Web3            = require('web3');
const uportReg        = require('../lib/uportregistry.js')
const startProviders  = require('./providerUtil')
const UportRegistry   = require('../build/contracts/UportRegistry.sol.js')
const personaInfo     = require('./persona_example.json')

const web3 = new Web3()

describe('Higher-level uportReg APIs', function () {
  this.timeout(30000)

  let web3Prov, ipfsProv, regAddr

  let ipfsHash = '0x1220aaabbbcccdddeeefff00011122233344';
  let ipfsHash2 = '0x1220';


  before((done) => {
    startProviders((err, provs) => {
      if (err) {
        throw new Error(err)
      }
      web3Prov = provs.web3Provider
      web3.setProvider(web3Prov)
      ipfsProv = provs.ipfsProvider

      uportReg.setWeb3Provider(web3Prov)
      uportReg.setIpfsProvider(ipfsProv)

      web3.eth.getAccounts((err, accs) => {
        if (err) {
          throw new Error(err)
        }
        accounts = accs
        // Setup for deployment of a new uport registry
        UportRegistry.setProvider(web3Prov)
        UportRegistry.new(accounts[0], {from: accounts[0], gas: 3141592}).then((reg) => {
          regAddr = reg.address;

          done()
        })
      })
    })
  })

  it('Creates personas and reads info', (done) => {
    var personas = [];
    var promises = [uportReg.setAttributes(regAddr, personaInfo.kobe, {from: accounts[0]}),
                    uportReg.setAttributes(regAddr, personaInfo.lebron, {from: accounts[1]}),
                    uportReg.setAttributes(regAddr, personaInfo.shaq, {from: accounts[2]})];

    Promise.all(promises).then(() => {
      // Check that we can recover the Persona info
      var promises = [uportReg.getAttributes(regAddr, accounts[0]),
                      uportReg.getAttributes(regAddr, accounts[1]),
                      uportReg.getAttributes(regAddr, accounts[2])];

      return Promise.all(promises);
    }).then((returnedPersonaInfo) => {
      assert.strictEqual(returnedPersonaInfo[0].name, 'Kobe Bryant');
      assert.strictEqual(returnedPersonaInfo[1].name, 'Lebron James');
      assert.strictEqual(returnedPersonaInfo[2].name, "Shaquille O'Neal");
      done();
    }).catch(done);
  })
})

