const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");

socket.on('allUsersConnected', () => {
  window.location.href = "/pages/Quiz_APR.html";
});

const main = () => {
  socket.emit('connectAPR', ROOMID);
  console.log(ROOMID);
  socket.emit('startGame', ROOMID);
};
main();