const TestRPC = require('ethereumjs-testrpc')
const ipfsd = require('ipfsd-ctl')

let web3Provider, ipfsProvider

module.exports = (cb) => {
  if (!web3Provider && !ipfsProvider) {
    web3Provider = TestRPC.provider()
    ipfsd.disposableApi((err, ipfsDaemon) => {
      ipfsProvider = ipfsDaemon
      if (err) {
        cb(err)
      }
      cb(null, {web3Provider: web3Provider, ipfsProvider: ipfsProvider})
    })
  } else {
    cb(null, {web3Provider: web3Provider, ipfsProvider: ipfsProvider})
  }
}
