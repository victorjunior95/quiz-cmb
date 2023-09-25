const BASE_URL = 'https://quiz-cmb-production-e86e.up.railway.app';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");

const createRoom = (roomId) => {
  socket.emit('connectAPR', roomId);
}

fetch(`${BASE_URL}/quiz`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao fazer a solicitação: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    localStorage.setItem("perguntasCompletas", JSON.stringify(data));
  })
  .catch(error => {
    console.error('Erro na solicitação:', error);
  });

socket.on('allUsersConnected', () => {
  window.location.href = "/pages/Quiz_APR.html";
});

const main = () => {
  createRoom(ROOMID);
  socket.emit('startGame', ROOMID);
  socket.emit('setTime', ROOMID);
  localStorage.removeItem("perguntasUsadas");
};
main();
