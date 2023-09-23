const userUtils = require('../utils/users');

const setTime = (socket) => (roomId) => {
  const rooms = userUtils.userRead();
  const difficulty = rooms[roomId].difficulty;
  // const phaseTime = difficulty === 2 ? 2400000 : 1200000;
  const phaseTime = difficulty === 2 ? 2400000 : 30000; // para teste
  rooms[roomId].time = {
    startTime: new Date().getTime(), 
    endTime: new Date().getTime() + phaseTime,
  }
  userUtils.userWriteNewData(roomId, rooms[roomId]);
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

const changeDifficulty = (socket) => (roomId, level) => {
  const rooms = userUtils.userRead();
  console.log(rooms);
  console.log(rooms[roomId].difficulty);
  rooms[roomId].difficulty === 1 ? rooms[roomId].difficulty = 2 : rooms[roomId].difficulty = 3;
  console.log(rooms);
  console.log(rooms[roomId].difficulty);

  userUtils.userRewrite(roomId, 'difficulty', level)
}

const continueGame = (socket) => (roomId) => {
  socket.to(roomId).emit('gameContinued');
}

module.exports = {
  setTime,
  startGame,
  sendClassification,
  changeDifficulty
}
