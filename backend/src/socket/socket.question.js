const userUtils = require('../utils/users');

const sendQuestion = (socket) => (question, roomId) => {
  const room = userUtils.userRead()[roomId];
  room.atualQuestion = question;
  userUtils.userWriteNewData(roomId, room);
  socket.broadcast.to(roomId).emit('receiveQuestion', question);
  socket.emit('receiveTotalTimer', room.time.endTime);
}

const startQuestionTimer = (socket) => (roomId, questionTime) => {
  socket.to(roomId).emit('receiveQuestionTimer', questionTime);
  socket.emit('receiveQuestionTimer', questionTime);
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
  startQuestionTimer,
}
