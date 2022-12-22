//External Libraries

import { io } from "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.1/socket.io.esm.min.js";
import { MultiplayerSubsystemClient } from "../utils/MultiplayerSubsystemClient.js";
import { MultiplayerGameInterface } from "../utils/MultiplayerGameInterface.js";

let MultiplayerSubsystemClientHandler;

MultiplayerSubsystemClientHandler = new MultiplayerSubsystemClient(io);
MultiplayerGameInterfaceHandler = new MultiplayerGameInterface(
  scene,
  camera,
  MultiplayerSubsystemClientHandler
);

class MultiplayerSystem {
  constructor() {}
  // Function for sending to the socket
  publishData = function (callsign, x, y, z) {
    var data = {
      x: x,
      y: y,
      z: z,
    };
    MultiplayerSubsystemClientHandler.emit(callsign, data);
  };
}

inAnimate = function () {
  if (frameIndex % 3 == 0) {
    //MultiplayerGameInterfaceHandler.updatePlayerState();
    // MultiplayerSubsystemClientHandler.emit(
    //   "PlayerState",
    //   MultiplayerGameInterfaceHandler.playerState
    // );

    MultiplayerSubsystemClientHandler.emit("PlayerState", { x: 1, y: 1, z: 2 });
    //MultiplayerGameInterfaceHandler.CheckForNewPlayersAndAddThemOrUpdatePositions();
  }
};
