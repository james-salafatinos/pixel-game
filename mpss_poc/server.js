const MultiplayerSubsystemServer =
  require("./src/utils/MultiplayerSubsystemServer").MultiplayerSubsystemServer;
require("dotenv").config();
const express = require("express");
const port = 3000;
const app = express();
const path = require("path");

app.get("/", function (request, response) {
  app.use("/public", express.static("./src/public"));
  app.use("/static", express.static("./src/static"));
  app.use("/modules", express.static("./src/modules"));
  app.use("/utils", express.static("./src/utils"));
  app.use("/data", express.static("./src/data"));
  app.use("/shaders", express.static("./src/shaders"));
  response.sendFile(__dirname + "/src/views/index.html");
});

var server = app.listen(process.env.PORT || port, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("server.listen() at http://" + host + ":" + port);
  console.log("server.listen() at http://localhost:" + port);
}
let MultiplayerSubsystemServerHandler = new MultiplayerSubsystemServer(server);
MultiplayerSubsystemServerHandler.listen();
