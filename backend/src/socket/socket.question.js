const userUtils = require('../utils/users');

const sendQuestion = (socket) => (question, roomId, questionTime) => {
  const room = userUtils.userRead()[roomId];
  room.atualQuestion = question;
  userUtils.userWriteNewData(roomId, room);
  socket.broadcast.to(roomId).emit('receiveQuestion', question);
}

const startTimer = (socket) => (roomId, questionTime) => {
  const room = userUtils.userRead()[roomId];
  socket.to(roomId).emit('receiveTimer', questionTime);
  socket.emit('receiveTimer', {questionTime, endTime: room.time.endTime});
}

const receiveAnswer = (socket) => ({ answer, lastAnswer, roomId, question, schoolName }) => {
  socket.to(roomId).emit('schoolAnswered', schoolName);
  
  const isCorrect = answer === question.resposta;
  const room = userUtils.userRead()[roomId];

  let ajustPoint = 0;
  if (lastAnswer) {
    const lastAnswerWasCorrect = lastAnswer === question.resposta;
    ajustPoint = lastAnswerWasCorrect ? -10 * room.difficulty : 10;
  }

  const newPoints = (isCorrect ? 10 * room.difficulty : -10) + ajustPoint;

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
  startTimer,
}
