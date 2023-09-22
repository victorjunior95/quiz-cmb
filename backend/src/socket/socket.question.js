const userUtils = require('../utils/users');

const sendQuestion = (socket) => (question, roomId, questionTime) => {
  const room = userUtils.userRead()[roomId];
  room.atualQuestion = question;
  userUtils.userWrite(roomId, room);
  socket.broadcast.to(roomId).emit('receiveQuestion', question);
  socket.to(roomId).emit('receiveTimer', questionTime);
  socket.emit('receiveTimer', questionTime);
}

const receiveAnswer = (socket) => ({ answer, roomId, question, schoolName }) => {
  socket.to(roomId).emit('schoolAnswered', schoolName);

  const isCorrect = answer === question.resposta;
  const newPoints = isCorrect ? 10 : -10;
  const room = userUtils.userRead()[roomId];

  const updatedUsers = room.users.map((user) => {
    if (user.schoolName === schoolName) {
      return {
        ...user,
        points: (user.points + newPoints) < 0 ? 0 : user.points + newPoints
      };
    }
    return user;
  });

  userUtils.userWrite(roomId, { ...room, users: updatedUsers });
}

module.exports = {
  sendQuestion,
  receiveAnswer,
}
