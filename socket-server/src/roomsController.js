const roomsController = {
  state: {
    rooms: [],
  },
  createRoom(roomId) {
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
    this.state.rooms.push(room);
  },
  getRoom(roomid) {
    for (let i = 0; i < this.state.rooms.length; i++) {
      if (this.state.rooms[i].id === roomid) {
        return this.state.rooms[i];
      }
    }
    return false;
  },
  getAllRooms() {
    return this.state.rooms;
  },
  getPlayer(room, playerId) {
    for (let i = 0; i < room.players.length; i++) {
      if (room.players[i].id === playerId) {
        return room.players[i];
      }
    }
    return false;
  },
  resetGame(roomid) {
    let room = this.getRoom(roomid);
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
  },
  alreadyPlaying(roomid) {
    let room = this.getRoom(roomid);
    for (let tile in room.tiles) {
      if (room.tiles[tile]) {
        return true;
      }
    }
    return false;
  },
};

module.exports = roomsController;
