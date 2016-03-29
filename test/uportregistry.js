var assert          = require('chai').assert;
var Web3            = require('web3');
var web3            = new Web3();
var web3prov        = new web3.providers.HttpProvider('http://localhost:8545');
web3.setProvider(web3prov);

var pudding         = require('ether-pudding')
pudding.setWeb3(web3);

var UportRegistry = require("../environments/development/contracts/UportRegistry.sol.js").load(pudding);
UportRegistry = pudding.whisk({binary: UportRegistry.binary, abi: UportRegistry.abi})

describe('UportRegistry', function() {

  var ipfsHash = '0x1220aaabbbcccdddeeefff00011122233344';
  var ipfsHash2 = '0x1220';

  it("should create a new registry and set attributes correctly", function(done) {
    this.timeout(10000);

    web3.eth.getAccounts(function (err, acct) {

      var previousPublished = acct[2];

      UportRegistry.new(previousPublished, {from:acct[0]}).then(function (reg) {
        reg.setAttributes(ipfsHash, {from:acct[0]}).then(function () {
          return reg.getAttributes.call(acct[0]);
        }).then(function(returnedBytes) {
          assert.strictEqual(returnedBytes, ipfsHash);
          reg.setAttributes(ipfsHash2, {from: acct[1]})
        }).then(function() {
          return reg.getAttributes.call(acct[1]);
        }).then(function(returnedBytes2) {
          assert.strictEqual(returnedBytes2, ipfsHash2);
          done();
        }).catch(done);
      })
    })
  })
});
