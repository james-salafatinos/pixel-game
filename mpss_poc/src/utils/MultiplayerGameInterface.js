import * as THREE from "/modules/three.module.js";

class MultiplayerGameInterface {
  constructor(MultiplayerSubsystemClientHandler) {
    this.RegisteredObjects = {};
    this.MultiplayerSubsystemClientHandler = MultiplayerSubsystemClientHandler;
  }
  register(name, meshProperty) {
    console.log("SOCKETID", this.MultiplayerSubsystemClientHandler.socket_id);
    this.RegisteredObjects[name] = {
      socket_id: this.MultiplayerSubsystemClientHandler.socket_id,
      meshProperty: meshProperty,
    };
  }

  _getRegisteredObjects() {
    return this.RegisteredObjects;
  }

  _viewAllRegisteredObjects() {
    console.log(
      "MultiplayerGameInterface._viewAllRegisterdObjects()",
      this.RegisteredObjects
    );
  }
}
export { MultiplayerGameInterface };
