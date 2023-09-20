const startGame = (room) => {
  socket.broadcast.to(room).emit('gameStarted');
}

module.exports = {
  startGame
}