const rooms = new Set(['General']);

module.exports = {
  rooms,
  getRooms: () => Array.from(rooms).sort(),
  addRoom: (room) => {
    if (!room || typeof room !== 'string') return false;
    rooms.add(room.trim());
    return true;
  }
};
