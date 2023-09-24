const BASE_URL = 'quiz-cmb-production.up.railway.app';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");
const changeDifficulty = JSON.parse(localStorage.getItem("changeDifficulty"));

socket.on('allUsersConnected', () => {
  window.location.href = "/pages/Quiz_APR.html";
});


const main = () => {
  if (changeDifficulty?.hasChangedLastAnswer) {
    socket.emit('changeDifficulty', ROOMID);
    socket.emit('setTime', ROOMID);
    socket.emit('startGame', ROOMID);
  }

  socket.emit('connectAPR', ROOMID);
  socket.emit('startGame', ROOMID);
};

main();
