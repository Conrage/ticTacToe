const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_ALLOWED_ORIGIN,
    handlePreflightRequest: (req, res, next) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": process.env.SOCKET_ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "GET,POST",
        "Access-Control-Allow-Headers": "x-access-token"
      });
      res.end();
    },
  },
});

const roomsController = require("./src/roomsController");

app.use(
  cors({
    origin: process.env.SOCKET_ALLOWED_ORIGIN,
  })
);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

const createPlayer = (id, shape) => {
  let player = {};
  player.id = id;
  player.shape = shape;

  return player;
};

const defineShape = (room) => {
  let shape;
  if (room.players.length == 0) {
    shape = "xis";
    return shape;
  }
  shape = room.players[0].shape == "xis" ? "bola" : "xis";
  return shape;
};

io.on("connection", (socket) => {
  socket.on("entered-room", (roomid) => {
    let room = roomsController.getRoom(roomid);
    let shape = defineShape(room);
    let player = createPlayer(socket.id, shape);
    room.players.push(player);
    socket.roomId = room.id;
    console.log(`User ${socket.id} connected in room ${socket.roomId}`);
    io.emit("entered-room-" + roomid, room);
  });
  socket.on("tile-click", (data) => {
    let room = roomsController.getRoom(socket.roomId);
    if (!roomsController.alreadyPlaying(socket.roomId)) {
      room.tiles[data] = roomsController.getPlayer(room, socket.id).shape;
      room.nextPlayer = socket.id;
      io.emit("tile-click-" + room.id, room);
      return;
    }
    if (room.nextPlayer == socket.id || room.tiles[data]) return;
    room.tiles[data] = roomsController.getPlayer(room, socket.id).shape;
    room.nextPlayer = socket.id;
    io.emit("tile-click-" + room.id, room);
  });
  socket.on("reset-game", (roomid) => {
    roomsController.resetGame(roomid);
    io.emit("reset-game-" + roomid, roomid);
    io.emit("game-update-" + roomid, roomsController.getRoom(roomid));
  });
  socket.on("get-room", (roomId) => {
    let room = roomsController.getRoom(roomId);
    socket.emit("get-room-" + roomId, room);
  });
  socket.on("create-room", (roomId) => {
    roomsController.createRoom(roomId);
  });
  socket.on("disconnect", () => {
    let room = roomsController.getRoom(socket.roomId);
    if (!room) return;
    for (let i = 0; i < room.players.length; i++) {
      if (room.players[i].id === socket.id) {
        room.players.splice(i, 1);
        io.emit("user-disconnected-" + socket.roomId);
        if (roomsController.alreadyPlaying(socket.roomId)) {
          roomsController.resetGame(socket.roomId);
          io.emit("reset-game-" + socket.roomId, socket.roomId);
          io.emit("game-update-" + socket.roomId, roomsController.getRoom(socket.roomId));
        }
      }
    }
    console.log(`User ${socket.id} disconnected from room ${socket.roomId}`);
  });
});

let PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Socket listening at ${PORT}`);
});
