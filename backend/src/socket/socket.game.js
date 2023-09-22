const userUtils = require('../utils/users');

const setTime = (socket) => (roomId) => {
  const rooms = userUtils.userRead();
  const difficulty = rooms[roomId].difficulty;
  // const phaseTime = difficulty === 2 ? 2400000 : 1200000;
  const phaseTime = difficulty === 2 ? 2400000 : 60000; // para teste
  rooms[roomId].time = {
    startTime: new Date().getTime(), 
    endTime: new Date().getTime() + phaseTime,
  }
  userUtils.userWrite(roomId, rooms[roomId]);
  socket.emit('receiveTimer', rooms[roomId].time);
}

const startGame = (socket) => (roomId) => {
  socket.to(roomId).emit('gameStarted');
}

const sendClassification = (socket) => (roomId, users) => {
  socket.to(roomId).emit('showClassificationUSR', users);
  const rooms = userUtils.userRead();
  socket.emit('receiveTimer', rooms[roomId].time);
}

module.exports = {
  setTime,
  startGame,
  sendClassification
}
