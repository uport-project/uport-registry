pragma solidity ^0.4.8;

contract UportRegistry{
  uint public version;
  address public previousPublishedVersion;
  mapping(bytes32 => mapping(address => mapping(address => bytes32))) public registry;

  function UportRegistry(address _previousPublishedVersion) {
    version = 2;
    previousPublishedVersion = _previousPublishedVersion;
  }

  event Set(
    bytes32 indexed registrationIdentifier,
    address indexed attestor,
    address indexed attestee);

  //create or update
  function set(bytes32 registrationIdentifier, address attestee, bytes32 value){
      Set(registrationIdentifier, msg.sender, attestee);
      registry[registrationIdentifier][msg.sender][attestee] = value;
  }

  function get(bytes32 registrationIdentifier, address attestor, address attestee) returns(bytes32){
      return registry[registrationIdentifier][attestor][attestee];
  }
}
