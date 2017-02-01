const assert          = require('chai').assert;
const Web3            = require('web3');
const UportRegistry        = require('../lib/uportregistry.js')
const startProviders  = require('./providerUtil')
const RegistryContract   = require('../build/contracts/UportRegistry.sol.js')
const personaInfo     = require('./persona_example.json')

const web3 = new Web3()

describe('Higher-level uportReg APIs', function () {
  this.timeout(30000)

  let registry

  let ipfsHash = '0x1220aaabbbcccdddeeefff00011122233344';
  let ipfsHash2 = '0x1220';


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

  it('Creates personas and reads info', (done) => {
    var personas = [];
    var promises = [registry.setAttributes(personaInfo.kobe, {from: accounts[0]}),
                    registry.setAttributes(personaInfo.lebron, {from: accounts[1]}),
                    registry.setAttributes(personaInfo.shaq, {from: accounts[2]})];

    Promise.all(promises).then(() => {
      // Check that we can recover the Persona info
      var promises = [registry.getAttributes(accounts[0]),
                      registry.getAttributes(accounts[1]),
                      registry.getAttributes(accounts[2])];

      return Promise.all(promises);
    }).then((returnedPersonaInfo) => {
      // console.log(returnedPersonaInfo[0].name, 'Kobe Bryant');
      // console.log(returnedPersonaInfo[1].name, 'Lebron James');
      // console.log(returnedPersonaInfo[2].name, "Shaquille O'Neal");

      assert.strictEqual(returnedPersonaInfo[0].name, 'Kobe Bryant');
      assert.strictEqual(returnedPersonaInfo[1].name, 'Lebron James');
      assert.strictEqual(returnedPersonaInfo[2].name, "Shaquille O'Neal");
      done();
    }).catch(done);
  })
})




[{"constant":false,"inputs":[{"name":"registrationIdentifier","type":"bytes32"},{"name":"attestor","type":"address"},{"name":"attestee","type":"address"}],"name":"get","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"previousPublishedVersion","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"address"}],"name":"registry","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"registrationIdentifier","type":"bytes32"},{"name":"attestee","type":"address"},{"name":"value","type":"bytes32"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_previousPublishedVersion","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"registrationIdentifier","type":"bytes32"},{"indexed":true,"name":"attestor","type":"address"},{"indexed":true,"name":"attestee","type":"address"}],"name":"Set","type":"event"}]
