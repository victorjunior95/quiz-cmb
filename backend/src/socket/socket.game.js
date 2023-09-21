const startGame = (socket) => (room) => {
  socket.to(room).emit('gameStarted');
}

module.exports = {
  startGame
}