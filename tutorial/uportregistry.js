(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.uportregistry = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "contract_name": "UportRegistry",
  "abi": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "registrationIdentifier",
          "type": "bytes32"
        },
        {
          "name": "issuer",
          "type": "address"
        },
        {
          "name": "subject",
          "type": "address"
        }
      ],
      "name": "get",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "version",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "previousPublishedVersion",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "bytes32"
        },
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "registry",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "registrationIdentifier",
          "type": "bytes32"
        },
        {
          "name": "subject",
          "type": "address"
        },
        {
          "name": "value",
          "type": "bytes32"
        }
      ],
      "name": "set",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_previousPublishedVersion",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "registrationIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "issuer",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "subject",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "updatedAt",
          "type": "uint256"
        }
      ],
      "name": "Set",
      "type": "event"
    }
  ],
  "unlinked_binary": "0x6060604052346100005760405160208061029083398101604052515b600360005560018054600160a060020a031916600160a060020a0383161790555b505b6102438061004d6000396000f300606060405263ffffffff60e060020a600035041663447885f0811461005057806354fd4d50146100845780636104464f146100a357806381895b73146100cc578063d79d8e6c14610100575b610000565b3461000057610072600435600160a060020a0360243581169060443516610121565b60408051918252519081900360200190f35b3461000057610072610158565b60408051918252519081900360200190f35b34610000576100b061015e565b60408051600160a060020a039092168252519081900360200190f35b3461000057610072600435600160a060020a036024358116906044351661016d565b60408051918252519081900360200190f35b346100005761011f600435600160a060020a0360243516604435610190565b005b6000838152600260209081526040808320600160a060020a03808716855290835281842090851684529091529020545b9392505050565b60005481565b600154600160a060020a031681565b600260209081526000938452604080852082529284528284209052825290205481565b81600160a060020a031633600160a060020a031684600019167feaf626c2c2ec7b7bd4328ffad20cd8bf2e631858020a5a4a0b4ea02276af3e91426040518082815260200191505060405180910390a46000838152600260209081526040808320600160a060020a033381168552908352818420908616845290915290208190555b5050505600a165627a7a72305820ab321041f3b9277120279f53803d3c6abdbe216f506a2ca6bf668bed7663c3a50029",
  "networks": {
    "1": {
      "links": {},
      "events": {
        "0xeaf626c2c2ec7b7bd4328ffad20cd8bf2e631858020a5a4a0b4ea02276af3e91": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "registrationIdentifier",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "name": "issuer",
              "type": "address"
            },
            {
              "indexed": true,
              "name": "subject",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "updatedAt",
              "type": "uint256"
            }
          ],
          "name": "Set",
          "type": "event"
        }
      },
      "address": "0xab5c8051b9a1df1aab0149f8b0630848b7ecabf6",
      "updated_at": 1487624027710
    },
    "3": {
      "links": {},
      "events": {
        "0xeaf626c2c2ec7b7bd4328ffad20cd8bf2e631858020a5a4a0b4ea02276af3e91": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "registrationIdentifier",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "name": "issuer",
              "type": "address"
            },
            {
              "indexed": true,
              "name": "subject",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "updatedAt",
              "type": "uint256"
            }
          ],
          "name": "Set",
          "type": "event"
        }
      },
      "address": "0x41566e3a081f5032bdcad470adb797635ddfe1f0",
      "updated_at": 1487622652023
    },
    "42": {
      "links": {},
      "events": {
        "0xeaf626c2c2ec7b7bd4328ffad20cd8bf2e631858020a5a4a0b4ea02276af3e91": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "registrationIdentifier",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "name": "issuer",
              "type": "address"
            },
            {
              "indexed": true,
              "name": "subject",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "updatedAt",
              "type": "uint256"
            }
          ],
          "name": "Set",
          "type": "event"
        }
      },
      "address": "0x5f8e9351dc2d238fb878b6ae43aa740d62fc9758",
      "updated_at": 1487622652023
    },
    "1492468252799": {
      "events": {
        "0xeaf626c2c2ec7b7bd4328ffad20cd8bf2e631858020a5a4a0b4ea02276af3e91": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "registrationIdentifier",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "name": "issuer",
              "type": "address"
            },
            {
              "indexed": true,
              "name": "subject",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "updatedAt",
              "type": "uint256"
            }
          ],
          "name": "Set",
          "type": "event"
        }
      },
      "links": {},
      "address": "0x711aacf896cfbe4539d6382631c3b0f3d8d52473",
      "updated_at": 1492468446090
    }
  },
  "schema_version": "0.0.5",
  "updated_at": 1492468446090
}
},{}],2:[function(require,module,exports){
var contractData = require("../build/contracts/UportRegistry.json")
module.exports = {contractData : contractData}

},{"../build/contracts/UportRegistry.json":1}]},{},[2])(2)
});