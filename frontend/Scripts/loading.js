const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");

const createRoom = (roomId) => {
  socket.emit('enterRoom', roomId);
}

fetch(`${BASE_URL}/quiz`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao fazer a solicitação: ' + response.status);
    }
    return response.json(); // Ou response.text() para obter uma resposta de texto
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
  localStorage.removeItem("perguntasUsadas");
};
main();