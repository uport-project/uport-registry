var assert      = require('chai').assert;
var uportReg    = require('../lib/uportregistry.js')
var Web3        = require('web3');
var web3        = new Web3();
var pudding     = require('ether-pudding');
var Promise     = require('bluebird');
var personaInfo = require('./persona_example.json');
var testUtils   = require('./testutils');

var UportRegistry = require("../environments/development/contracts/UportRegistry.sol.js").load(pudding);
UportRegistry = pudding.whisk({binary: UportRegistry.binary, abi: UportRegistry.abi});

describe('Higher-level uportReg APIs', function () {
  this.timeout(20000);

  before(function (done) {
    testUtils.startProviders(function (err, res) {
      // pudding.setWeb3(web3); // doesn't seem to be needed
      web3.setProvider(res.web3Provider);
      uportReg.setWeb3Provider(res.web3Provider);
      uportReg.setIpfsProvider(res.ipfsProvider);
      done();
    });
  });

  it("Creates personas and reads info", function (done) {
    web3.eth.getAccounts(function (err, acct) {
      var personas = [];
      var regAddr = '';
      var prevRegAddr = acct[3];

      UportRegistry.new(prevRegAddr, {from: acct[0]}).then(function (reg) {

        regAddr = reg.address;
        var promises = [uportReg.setAttributes(regAddr, personaInfo.kobe, {from: acct[0]}),
                        uportReg.setAttributes(regAddr, personaInfo.lebron, {from: acct[1]}),
                        uportReg.setAttributes(regAddr, personaInfo.shaq, {from: acct[2]})];

        return Promise.all(promises);
      }).then(function () {
        // Check that we can recover the Persona info
        var promises = [uportReg.getAttributes(regAddr, acct[0]),
                        uportReg.getAttributes(regAddr, acct[1]),
                        uportReg.getAttributes(regAddr, acct[2])];

        return Promise.all(promises);
      }).then(function (returnedPersonaInfo) {
        assert.strictEqual(returnedPersonaInfo[0].name, 'Kobe Bryant');
        assert.strictEqual(returnedPersonaInfo[1].name, 'Lebron James');
        assert.strictEqual(returnedPersonaInfo[2].name, "Shaquille O'Neal");
        done();
      }).catch(done);
    });
  });
});
