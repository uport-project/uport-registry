# Registry Tutorial

This tutorial will get you up-to-speed on how to use the uPort registry. The design of the registry is very abstract, each entry in the registry consists of an address `issuer`, an address `subject`, as well as a `topic` and a `value`, both of whom are of type `bytes32`.

We'll give an how to use the registry, dealing with how to set app-specific public data for your app.

## App-specific data

We have a very simple app, given by the files `app_specific_data.html` and `app_specific_data.js`. In the "Connect uPort" section