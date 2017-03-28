pragma solidity 0.4.8;

contract UportRegistry {
  uint public version;
  address public previousPublishedVersion;
  mapping(address => mapping(bytes32 => mapping(bytes32 => bytes32))) public registry;

  function UportRegistry(address _previousPublishedVersion) {
    version = 3;
    previousPublishedVersion = _previousPublishedVersion;
  }

  event Set (
    address indexed from,
    address indexed to,
    bytes32 indexed key,
    bytes32         value,
    uint256         updatedAt
  );

  //create or update
  function set(address to, bytes32 key, bytes32 value) {
      Set(msg.sender, to, key, value, now);
      registry[msg.sender][to][key] = value;
  }

  function get(address from, address to, bytes32 key) constant returns(bytes32) {
      return registry[from][to][key];
  }
}
