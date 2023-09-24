const userUtils = require('../utils/users');

const setTime = (socket) => (roomId) => {
  const rooms = userUtils.userRead();
  const difficulty = rooms[roomId].difficulty;
  // const getTime = {
  //   1: {
  //     time: 1200000
  //   },
  //   2: {
  //     time: 2400000
  //   },
  //   3: {
  //     time: 1200000
  //   }
  // };

  // teste
  const getTime = {
    1: {
      time: 45000
    },
    2: {
      time: 90000
    },
    3: {
      time: 45000
    }
  };

  rooms[roomId].time = {
    startTime: new Date().getTime(), 
    endTime: getTime[difficulty]
  };

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

const changeDifficulty = (socket) => (roomId) => {
  const rooms = userUtils.userRead();

  rooms[roomId].difficulty === 1 ? rooms[roomId].difficulty = 2 : rooms[roomId].difficulty = 3;

  userUtils.userRewrite(roomId, 'difficulty', rooms[roomId].difficulty);
}

module.exports = {
  setTime,
  startGame,
  sendClassification,
  changeDifficulty,
}
