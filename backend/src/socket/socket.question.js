const userUtils = require('../utils/users');

const sendQuestion = (socket) => (question, roomId, questionTime) => {
  const room = userUtils.userRead()[roomId];
  room.atualQuestion = question;
  userUtils.userWriteNewData(roomId, room);
  socket.broadcast.to(roomId).emit('receiveQuestion', question);
  socket.to(roomId).emit('receiveTimer', questionTime);
  socket.emit('receiveTimer', {questionTime, endTime: room.time.endTime});
}

const receiveAnswer = (socket) => ({ answer, roomId, question, schoolName }) => {
  socket.to(roomId).emit('schoolAnswered', schoolName);

  const isCorrect = answer === question.resposta;
  const room = userUtils.userRead()[roomId];
  const newPoints = isCorrect ? 10 * room.difficulty : -10;

  const updatedUsers = room.users.map((user) => {
    if (user.schoolName === schoolName) {
      return {
        ...user,
        points: (user.points + newPoints) < 0 ? 0 : user.points + newPoints
      };
    }
    return user;
  });

  userUtils.userWriteNewData(roomId, { ...room, users: updatedUsers });
}

module.exports = {
  sendQuestion,
  receiveAnswer,
}
