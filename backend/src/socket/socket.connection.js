const room = require('./socket.room');
const game = require('./socket.game');
const question = require('./socket.question');
const classification = require('./socket.classification');

const connection = (socket) => {

  // Room events
  socket.on('createRoom', room.createRoom(socket));
  socket.on('joinRoom', room.joinRoom(socket));
  socket.on('enterRoom', room.enterRoom(socket));
  socket.on('clearConnections', room.clearConnections(socket));

  // Game events
  socket.on('startGame', game.startGame(socket));

  // Question events
  socket.on('sendQuestion', question.sendQuestion(socket));
  socket.on('sendAnswer', question.sendAnswer(socket));

  // Classification events
  socket.on('requestClassification', classification.requestClassification(socket));

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
}

module.exports = connection;