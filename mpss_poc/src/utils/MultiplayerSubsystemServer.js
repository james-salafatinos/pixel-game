class MultiplayerSubsystemServer {
  constructor(server) {
    this.ServerObservedState = {};
    this.ServerAuthoritativeState = {};

    this.io = require("socket.io")(server, {
      cors: {
        // origin: "https://multiplayer-xpzpk.ondigitalocean.app/",
        // origin: "http://localhost:8080",
        origin:
          process.env.ENVIRONMENT == "DEV"
            ? "http://localhost:3000"
            : "https://multiplayer-xpzpk.ondigitalocean.app/",
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"],
        credentials: true,
      },
      allowEIO3: true,
    });
  }
  listen() {
    console.log("MultiplayerSubsystemServer.listen()");
    let MSS = this;

    this.io.sockets.on("connection", function (socket) {
      console.log("We have a new client: " + socket.id);
      console.log("Total Players \n ", MSS.io.engine.clientsCount);

      socket.broadcast.emit(`Server.ConnectionMadeWith`, socket.id);

      socket.on("aClientState", function (data) {
        let greenlight = true;
        if (data == null) {
          greenlight = false;
        }
        if (data.socket_id == undefined) {
          greenlight = false;
        }

        if (greenlight == true) {
          console.log(MSS.ServerObservedState);

          //Records the data from each client
          MSS.ServerObservedState[data.socket_id] = data;

          MSS.ServerAuthoritativeState = MSS.ServerObservedState;

          socket.broadcast.emit(
            `ServerAuthoritativeState`,
            MSS.ServerAuthoritativeState
          );
        }
      });

      socket.on("disconnect", function () {
        console.log("Client ", socket.id, " has disconnected");
        socket.broadcast.emit(`PlayerDisconnect`, socket.id);

        delete MSS.ServerObservedState[socket.id];
        console.log(
          "Client ",
          socket.id,
          " has been deleted from ServerObservedState"
        );

        console.log("Total Players \n ", MSS.io.engine.clientsCount);
      });
    });
  }

  RulesEngine() {}
}

exports.MultiplayerSubsystemServer = MultiplayerSubsystemServer;
