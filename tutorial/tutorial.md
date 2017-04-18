# Registry Tutorial

This tutorial will get you up-to-speed on how to use the uPort registry. The design of the registry is very abstract, each entry in the registry consists of an address `issuer`, an address `subject`, as well as a `topic` and a `value`, both of whom are of type `bytes32`.

We'll give an how to use the registry, dealing with how to set app-specific public data for your app.

## App-specific data

We expect some apps to want to allow their users to store data about them that are specifically connected to the app. This could be for instance their encryption key as used in a chat app.

In our example we have a very simple app, given by the files `app_specific_data.html` and `app_specific_data.js`. In the "Connect uPort" section we can connect our uPort and read some public data (our name in this case) as well as the App specific data connected to our identity. This should read `0x00000000...` if no data is set.

The app specific data is read using the code:

```
    reg.get("myAppData", globalState.uportId, appId, function(err, data) {
      globalState.appDataRead = data
      render()
    })
```

We see here that the user is the issuer, the identifier of the app, `appId`, is the subject. The topic is `myAppData`, and the value read is the registered app-specific data.

In the "Set app-specific data" section of the app we can set the app-specific data. To set the app-specific data we use the code

```
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
```

The data can be entered either as a byte string, starting with `0x`, or as a string. If it's read in as a string it will be automatically converted to the corresponding byte string.

Again the user (i.e. `msg.sender`) is the issuer, the `appId` is the subject, and the `topic` is `"myAppData"`. If we set the app data and then do "connect uPort" again, we will see the recently set data.

We see here also the generality of the registry. The `get()` and `set()` functions can be used for a wide variety of use cases.
