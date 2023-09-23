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

  userUtils.userWriteNewData(roomId, { ...room, users: updatedUsers });
}

// timesOver vai para a próxima fase
// Se estiver no meio de uma pergunta, espera acabar e então vai para a tela de mudança de fase
// Se precaver para mudança de fase no meio de Loading

module.exports = {
  sendQuestion,
  receiveAnswer,
}
