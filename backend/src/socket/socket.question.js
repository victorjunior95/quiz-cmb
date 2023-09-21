const sendQuestion = (socket) => (question, roomId) => {
  console.log('sending question');
  socket.broadcast.to(roomId).emit('receiveQuestion', question);
}

const sendAnswer = (socket) => ({ answer, roomId }) => {
  
  socket.to(roomId).emit('receiveAnswer', answer);
}

module.exports = {
  sendQuestion,
  sendAnswer
}