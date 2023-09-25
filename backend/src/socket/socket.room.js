const userUtils = require('../utils/users');

const createRoom = (socket) => (room) => {
  userUtils.userWriteNewData(room, { users: [], answered: [], difficulty: 1 });
  socket.join(room);
}

const joinRoom = (socket) => (schoolName, roomId) => {
  const rooms = userUtils.userRead();
  if(!rooms[roomId]) {
    socket.emit('roomNotExists');
    return;
  }

  const users = rooms[roomId].users;
  const user = users.find((user) => user.schoolName === schoolName);

  // Aparentemente sem uso - conferir com time
  if (user) {
    socket.emit('schoolNameExists');
    return;
  }

  // Todos os usuários já começam com 10 pontos
  users.push({ id: users.length + 1, schoolName, points: 10 });

  userUtils.userWriteNewData(roomId, { ...rooms[roomId], users });
  socket.join(roomId);
  console.log(`User ${schoolName} connected to room ${roomId}`);
  socket.to(roomId).emit('currentUser', schoolName);
  socket.to(roomId).emit('usersConnected', users);
}

const connectAPR = (socket) => (roomId) => {
  socket.join(roomId);
}

const connectAPRAnswer = (socket) => (roomId) => {
  socket.join(roomId);
  socket.broadcast.to(roomId).emit('getAnswer');
}

const connectAPRClassification = (socket) => (roomId) => {
  socket.join(roomId);
  socket.broadcast.to(roomId).emit('getClassification', roomId);
}

let waitingAnswerUsers = [];
const connectAnswer = (socket) => (roomId) => {
  const room = userUtils.userRead()[roomId];
  if(!room) {
    socket.emit('roomNotExists');
    return;
  }

  waitingAnswerUsers.push(roomId);
  socket.join(roomId);

  if (room.users.length === waitingAnswerUsers.length) {
    socket.to(roomId).emit('showAnswer', room.atualQuestion);
    waitingAnswerUsers = [];
  }
}

let waitingUsers = [];
const connectClassification = (socket) => (roomId) => {
  const room = userUtils.userRead()[roomId];
  if(!room) {
    socket.emit('roomNotExists');
    return;
  }

  waitingUsers.push(roomId);
  socket.join(roomId);
  
  if (room.users.length === waitingUsers.length) {
    socket.to(roomId).emit('showClassificationAPR', room.users);
    waitingUsers = [];
  }
}

let connectedUsers = [];
const enterRoom = (socket) => (roomId, schoolName) => {
  const room = userUtils.userRead()[roomId];
  if(!room) {
    socket.emit('roomNotExists');
    return;
  }

  connectedUsers.push(schoolName);
  socket.join(roomId);
  if (room.users.length === connectedUsers.length) {
    socket.to(roomId).emit('allUsersConnected');
    connectedUsers = [];
  }
}

const clearConnections = () => () => {
  connectedUsers = [];
}

module.exports = {
  createRoom,
  joinRoom,
  enterRoom,
  clearConnections,
  connectAPR,
  connectAnswer,
  connectAPRAnswer,
  connectAPRClassification,
  connectClassification,
}
