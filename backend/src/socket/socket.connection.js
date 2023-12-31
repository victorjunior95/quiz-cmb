const room = require('./socket.room');
const game = require('./socket.game');
const question = require('./socket.question');
const classification = require('./socket.classification');

const connection = (socket) => {

  // Room events
  socket.on('createRoom', room.createRoom(socket));
  socket.on('joinRoom', room.joinRoom(socket));
  socket.on('enterRoom', room.enterRoom(socket));
  socket.on('connectAPR', room.connectAPR(socket));
  socket.on('clearConnections', room.clearConnections(socket));
  socket.on('connectAnswer', room.connectAnswer(socket));
  socket.on('connectAPRAnswer', room.connectAPRAnswer(socket));
  socket.on('connectAPRClassification', room.connectAPRClassification(socket));
  socket.on('connectClassification', room.connectClassification(socket));

  // Game events
  socket.on('setTime', game.setTime(socket));
  socket.on('startGame', game.startGame(socket));
  socket.on('sendClassification', game.sendClassification(socket));
  socket.on('changeDifficulty', game.changeDifficulty(socket));
  
  // Question events
  socket.on('sendQuestion', question.sendQuestion(socket));
  socket.on('receiveAnswer', question.receiveAnswer(socket));
  socket.on('startQuestionTimer', question.startQuestionTimer(socket));

  // Classification events
  socket.on('requestClassification', classification.requestClassification(socket));

  //Está sendo chamado em todo momento, verificar a necessidade
  // socket.on('disconnect', () => {
  //   console.log('user disconnected');
  // });
}

module.exports = connection;
