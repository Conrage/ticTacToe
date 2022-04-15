const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  let room = Math.round(Math.random() * 100);
  res.redirect("/" + room);
});

app.get("/:room", function (req, res) {
  let roomId = req.params.room;
  if (getRoom(roomId)) {
    if (roomAlreadyFull(getRoom(roomId))) {
      res.redirect("/");
      return;
    }
  }
  createRoom(roomId);
  res.sendFile(__dirname + "/index.html");
});

let rooms = [];

const createPlayer = (id, form) => {
  let player = {};
  player.id = id;
  player.form = form;

  return player;
};

const getPlayer = (room, playerId) => {
  for (let i = 0; i < room.players.length; i++) {
    if (room.players[i].id === playerId) {
      return room.players[i];
    }
  }
  return false;
};

const createRoom = (roomId) => {
  let room = {
    id: roomId,
    players: [],
    tiles: {
      tile_1: false,
      tile_2: false,
      tile_3: false,
      tile_4: false,
      tile_5: false,
      tile_6: false,
      tile_7: false,
      tile_8: false,
      tile_9: false,
    },
    nextPlayer: "",
  };
  rooms.push(room);
};

const roomAlreadyFull = (room) => {
  if (room.players.length > 1) {
    return true;
  }
  return false;
};

const getRoom = (roomid) => {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].id === roomid) {
      return rooms[i];
    }
  }
  return false;
};

const resetGame = (roomid) => {
  let room = getRoom(roomid);
  room.tiles = {
    tile_1: false,
    tile_2: false,
    tile_3: false,
    tile_4: false,
    tile_5: false,
    tile_6: false,
    tile_7: false,
    tile_8: false,
    tile_9: false,
  };
};

const alreadyPlaying = (roomid) => {
  let room = getRoom(roomid);
  for(let tile in room.tiles) {
    if(room.tiles[tile]){
      return true;
    }
  }
  return false;
}

io.on("connection", (socket) => {
  socket.on("entered-room", (roomid) => {
    let room = getRoom(roomid);
    let firstPlayer = room.players.length == 0 ? true : false;
    let form;
    if (!firstPlayer) {
      if (room.players[0].form == "xis") {
        form = "bola";
      } else {
        form = "xis";
      }
    } else {
      form = "xis";
    }
    let player = createPlayer(socket.id, form);
    room.players.push(player);
    if (firstPlayer) {
      room.nextPlayer = socket.id;
    }
    socket.roomId = room.id;
    console.log(`User ${socket.id} connected in room ${socket.roomId}`);
    io.emit("entered-room-" + roomid, room);
  });
  socket.on("tile-click", (data) => {
    let room = getRoom(socket.roomId);
    if(!alreadyPlaying(socket.roomId)){
      room.tiles[data] = getPlayer(room, socket.id).form;
      room.nextPlayer = socket.id;
      io.emit("tile-click-" + room.id, room);
      return;
    }
    if (room.nextPlayer == socket.id) return;
    if (room.tiles[data]) return;
    room.tiles[data] = getPlayer(room, socket.id).form;
    room.nextPlayer = socket.id;
    io.emit("tile-click-" + room.id, room);
  });
  socket.on("reset-game", (roomid) => {
    resetGame(roomid);
    io.emit("reset-game-" + roomid, roomid);
    io.emit("game-update-" + roomid, getRoom(roomid));
  });
  socket.on("disconnect", () => {
    let room = getRoom(socket.roomId);
    if(!room) return;
    for (let i = 0; i < room.players.length; i++) {
      if (room.players[i].id === socket.id) {
        room.players.splice(i, 1);
        io.emit('user-disconnected-' + socket.roomId);
        if(alreadyPlaying(socket.roomId)){
          resetGame(socket.roomId);
          io.emit("reset-game-" + socket.roomId, socket.roomId);
          io.emit("game-update-" + socket.roomId, getRoom(socket.roomId));
        }
      }
    }
    console.log(`User ${socket.id} disconnected from room ${socket.roomId}`);
  });
});

let PORT = process.env.PORT || 3000;

server.listen(PORT, (err) => {
  console.log("Server listening on :" + PORT);
});
