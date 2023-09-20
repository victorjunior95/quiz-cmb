const createRoom = (room) => {
  socket.join(room);
}

const joinRoom = (schoolName, room) => {
  socket.join(room);
  socket.to(room).emit('userConnected', schoolName);
}

module.exports = {
  createRoom,
  joinRoom
}