const userUtils = require('../utils/users')

const createRoom = (socket) => (room) => {
  userUtils.userWrite(room, { users: [], answered: [] });
  socket.join(room);
}

const joinRoom = (socket) => (schoolName, roomId) => {
  const rooms = userUtils.userRead();
  const users = rooms[roomId].users;
  const user = users.find((user) => user.schoolName === schoolName);
  if (user) {
    socket.emit('schoolNameNotExists');
    return;
  }
  users.push({ id: users.length + 1, schoolName, points: 0 });

  userUtils.userWrite(roomId, { ...rooms[roomId], users });
  socket.join(roomId);
  console.log(`User ${schoolName} connected to room ${roomId}`);
  socket.to(roomId).emit('userConnected', schoolName);
}

const connectAPR = (socket) => (roomId) => {
  socket.join(roomId);
}

const connectAPRAnswer = (socket) => (roomId) => {
  socket.join(roomId);
  socket.broadcast.to(roomId).emit('getAnswer');
}

let waitingUsers = [];
const connectAnswer = (socket) => (roomId) => {
  socket.join(roomId);
  const room = userUtils.userRead()[roomId];
  waitingUsers.push(roomId);

  if (waitingUsers.length === room.users.length) {
    
    socket.to(roomId).emit('showAnswer', room.atualQuestion);
    waitingUsers = [];
  }
}

let connectedUsers = [];
const enterRoom = (socket) => (roomId, schoolName) => {
  const users = userUtils.userRead()[roomId].users;
  connectedUsers.push(schoolName);
  socket.join(roomId);
  if (connectedUsers.length === users.length) {
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
}