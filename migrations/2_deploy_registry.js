const Registry = artifacts.require('UportRegistry')

module.exports = function (deployer) {
  let idx = process.argv.indexOf('--prevAddr')
  if (idx < 0) {
    throw new Error('Please specify the address of the previous registry.')
  }
  let prevRegistryAddress = process.argv[idx + 1]
  if (!prevRegistryAddress) {
    throw new Error('Please specify the address of the previous registry.')
  } else if (prevRegistryAddress === 'none') {
    prevRegistryAddress = '0x0000000000000000000000000000000000000000'
  }
  deployer.deploy(Registry, prevRegistryAddress)
}
