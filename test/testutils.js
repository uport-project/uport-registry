'use strict';

var TestRPC = require("ethereumjs-testrpc");
var ipfsd   = require('ipfsd-ctl');
var Web3    = require('web3');
var web3    = new Web3();

var TestRpcPort = 8545;

var server, web3Prov, ipfsProv;

module.exports = {
  startProviders: function (callback) {
    if(!server && !ipfsProv && !web3Prov) {
      server = TestRPC.server();
      server.listen(TestRpcPort, function (err, blockchain) {
        web3Prov = new web3.providers.HttpProvider('http://localhost:' + TestRpcPort);
        ipfsd.disposableApi(function (err, ipfsDaemon) {
          ipfsProv = ipfsDaemon
          callback(null, { web3Provider: web3Prov, ipfsProvider: ipfsProv });
        });
      });
    } else {
      callback(null, { web3Provider: web3Prov, ipfsProvider: ipfsProv });
    }
  }
};
