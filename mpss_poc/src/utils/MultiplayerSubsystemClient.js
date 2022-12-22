class MultiplayerSubsystemClient {
  constructor(io) {
    var MSC = this;
    this.io = io;
    this.socket = this.io.connect(window.location.href);
    this.ServerState = null;
    this.disconnected_ids = [];
    this.LastServerState = null;

    // client-side
    this.socket.on("connect", function () {
      console.log(MSC.socket.id); // x8WIv7-mJelg7on_ALbx
    });

    //Connect
    this.socket.on("Server.ConnectionMadeWith", function (data) {
      if (data == null) {
        throw new Error("Client.on ConnectionMadeWith :: No Socket ID");
      }
      this.socket_id = data;
      console.log("Client.ConnectionMadeWith", data);
    });

    //ServerSTate
    this.socket.on("ServerAuthoritativeState", function (data) {
      console.log("Client.ServerAuthoritativeState", data);
      MSC.LastServerState = MSC.ServerState;
      MSC.ServerState = data;
    });

    //Disconnect
    this.socket.on("PlayerDisconnect", function (disconnected_socket_id) {
      console.log("Client.DisconnectedSocketId", disconnected_socket_id);
      MSC.disconnected_ids.push(disconnected_socket_id);
    });
  }

  emit(data) {
    this.socket.emit("aClientState", data);
    console.log("Client.emit", data);
  }

  update(rgs) {
    console.log(this.ServerState);
  }
}

export { MultiplayerSubsystemClient };
