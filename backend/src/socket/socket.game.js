const startGame = (socket) => (room) => {
  socket.to(room).emit('gameStarted');
}

const sendClassification = (socket) => (room, users) => {
  socket.to(room).emit('showClassificationUSR', users);
}

module.exports = {
  startGame,
  sendClassification
}