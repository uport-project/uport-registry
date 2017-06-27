// Copyright (C) 2016, 2017  ConsenSys, Inc
// Copyright (C) 2017        DappHub, LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
// http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

pragma solidity 0.4.8;

contract UportRegistry {
  uint public version;
  address public lastVersion;
  mapping(address=>
    mapping(address=>
      mapping(bytes32=>
        bytes32))) public registry;

  function UportRegistry(address _lastVersion) {
    version = 3;
    lastVersion = _lastVersion;
  }

  event Set (
    address indexed src,
    address indexed dst,
    bytes32 indexed key,
    bytes32 indexed val,
    uint256         tau
  ) anonymous;

  //create or update
  function set(address dst, bytes32 key, bytes32 val) {
      Set(msg.sender, dst, key, val, now);
      registry[msg.sender][dst][key] = val;
  }

  function get(address src, address dst, bytes32 key) constant returns (bytes32 val) {
      return registry[src][dst][key];
  }
}
