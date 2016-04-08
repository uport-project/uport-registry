"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var factory = function factory(Pudding) {
  // Inherit from Pudding. The dependency on Babel sucks, but it's
  // the easiest way to extend a Babel-based class. Note that the
  // resulting .js file does not have a dependency on Babel.

  var UportRegistry = (function (_Pudding) {
    _inherits(UportRegistry, _Pudding);

    function UportRegistry() {
      _classCallCheck(this, UportRegistry);

      _get(Object.getPrototypeOf(UportRegistry.prototype), "constructor", this).apply(this, arguments);
    }

    return UportRegistry;
  })(Pudding);

  ;

  // Set up specific data for this class.
  UportRegistry.abi = [{ "constant": true, "inputs": [{ "name": "personaAddress", "type": "address" }], "name": "getAttributes", "outputs": [{ "name": "", "type": "bytes" }], "type": "function" }, { "constant": true, "inputs": [], "name": "version", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" }, { "constant": true, "inputs": [], "name": "previousPublishedVersion", "outputs": [{ "name": "", "type": "address" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "ipfsHash", "type": "bytes" }], "name": "setAttributes", "outputs": [], "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "ipfsAttributeLookup", "outputs": [{ "name": "", "type": "bytes" }], "type": "function" }, { "inputs": [{ "name": "_previousPublishedVersion", "type": "address" }], "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_sender", "type": "address" }, { "indexed": false, "name": "_timestamp", "type": "uint256" }], "name": "AttributesSet", "type": "event" }];
  UportRegistry.binary = "6060604052604051602080610393833950608060405251600160008190558054600160a060020a03191682179055506103578061003c6000396000f3606060405260e060020a6000350463446d5aa4811461004757806354fd4d50146100be5780636104464f146100c75780636737c877146100d9578063884179d814610192575b005b6101fd60043560006060818152600160a060020a0383168252600260208181526040938490208054600181161561010002600019011692909204601f810182900490910260a0908101909452608081815292938282801561034b5780601f106103205761010080835404028352916020019161034b565b61026b60005481565b61026b600154600160a060020a031681565b60206004803580820135601f81018490049093026080908101604052606084815261004594602493919291840191819083828082843750949650505050505050600160a060020a0333166000908152600260208181526040832084518154828652948390209194600181161561010002600019011693909304601f90810192909204810192916080908390106102a857805160ff19168380011785555b506102d89291505b8082111561031c576000815560010161017e565b6101fd60043560026020818152600092835260409283902080546080601f6000196101006001851615020190921694909404908101839004909202830190935260608181529291828280156102a05780601f10610275576101008083540402835291602001916102a0565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f16801561025d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6060908152602090f35b820191906000526020600020905b81548152906001019060200180831161028357829003601f168201915b505050505081565b82800160010185558215610176579182015b828111156101765782518260005055916020019190600101906102ba565b5050604080514281529051600160a060020a033316917f70c8251d1f51f94ab26213a0dd53ead1bf32aeeb2e95bb6497d8d8bbde61b98d919081900360200190a250565b5090565b820191906000526020600020905b81548152906001019060200180831161032e57829003601f168201915b5050505050905091905056";

  if ("" != "") {
    UportRegistry.address = "";

    // Backward compatibility; Deprecated.
    UportRegistry.deployed_address = "";
  }

  UportRegistry.generated_with = "1.0.3";
  UportRegistry.contract_name = "UportRegistry";

  return UportRegistry;
};

// Nicety for Node.
factory.load = factory;

if (typeof module != "undefined") {
  module.exports = factory;
} else {
  // There will only be one version of Pudding in the browser,
  // and we can use that.
  window.UportRegistry = factory;
}