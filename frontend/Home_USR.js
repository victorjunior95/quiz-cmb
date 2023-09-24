const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);


document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem("roomData");
  socket.on('gameStarted', () => {
    window.location.href = "/pages/Quiz_USR.html";
  });
  const sendButton = document.getElementById('sendButton');
  
  sendButton.addEventListener('click', async () => {
    try {
      const inputElement = document.getElementById('textInput');
      const inputRoom = document.getElementById('roomIdInput');
      const inputRoomValue = inputRoom.value;
      const inputValue = inputElement.value;
  
      if (inputValue === "") {
        alert("Por favor, informe o nome de sua escola!");
        return;
      }

      if (inputRoomValue === "") {
        alert("Por favor, informe o código da sala!");
        return;
      }

      // Dados a serem enviados para o servidor
      const data = {
        user: inputValue,
        roomId: inputRoomValue
      };

      localStorage.setItem("roomData", JSON.stringify(data));
      
      socket.emit('joinRoom', data.user, data.roomId);
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  });
});
