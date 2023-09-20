const sendQuestion = (question, roomId) => {
  socket.broadcast.to(roomId).emit('receiveQuestion', question);
}

module.exports = {
  sendQuestion
}