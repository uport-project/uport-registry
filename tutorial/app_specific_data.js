/* global Web3 globalState render */

// Setup

const Connect = window.uportconnect.Connect
const appName = 'AppDataTutorial'
const connect = new Connect(appName)
const web3 = connect.getWeb3()
const UportRegistry = window.uportregistry.contractData
const mnid = uportregistry.mnid
console.log(UportRegistry)
const appId = '0xe2fef711a5988fbe84b806d4817197f033dde050'

const Registry = web3.eth.contract(UportRegistry.abi)
const reg = Registry.at(UportRegistry.networks['3'].address)

// uPort connect

const uportConnect = () => {
  connect.requestCredentials().then((credentials) => {
    console.log(credentials)
    
    if (mnid.isMNID(credentials.address)) {
      globalState.uportId = mnid.decode(credentials.address).address
    }
    else {
      globalState.uportId = credentials.address
    }

    globalState.name = credentials.name
    reg.get("myAppData", globalState.uportId, appId, function(err, data) {
      globalState.appDataRead = data
      render()
    })
  }, console.err)
}

// Set app data
const setAppData = () => {
  const appData = globalState.appDataWrite
  const gasPrice = 20000000000
  const gas = 500000

  reg.set("myAppData", appId, appData,
          {
            from: globalState.uportId,
            value: 0,
            gasPrice: gasPrice,
            gas: gas          
          }, (error, txHash) => {
            if (error) { throw error }
            console.log('App data set.')
            console.log(appData)
            render()
          })
}
