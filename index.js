const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { io } = require("socket.io-client");
const socket = io("wss://shielded-chamber-27050.herokuapp.com/");

const roomAlreadyFull = (room) => {
  if (room.players.length > 1) {
    return true;
  }
  return false;
};

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  let room = Math.round(Math.random() * 100);
  res.redirect("/" + room);
});

app.get("/:room", function (req, res) {
  let roomId = req.params.room;
  let room;
  socket.emit("get-room", roomId);
  socket.on("get-room-" + roomId, (data) => {
    room = data;
  });
  if (room) {
    if (roomAlreadyFull(room)) {
      res.redirect("/");
      return;
    }
  }
  socket.emit("create-room", roomId);
  res.sendFile(__dirname + "/index.html");
});

let PORT = process.env.PORT || 5000;

server.listen(PORT, (err) => {
  console.log("Server listening on :" + PORT);
});
