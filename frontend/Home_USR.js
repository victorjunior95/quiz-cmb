const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);


document.addEventListener('DOMContentLoaded', () => {
  socket.on('gameStarted', () => {
    window.location.href = "/frontend/pages/Quiz_USR.html";
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
      
      socket.emit('joinRoom', data.user, data.roomId);

      // Enviando a requisição POST para o backend usando a Fetch API
      // const response = await fetch(`${BASE_URL}/users`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(data)
      // });

      // const result = await response.json();
      // console.log('Resposta do servidor:', result);
    
      // window.location.href = "../pages/loading.html";
      // alert(`Bem-vindo, ${escola}!`);

    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  });
});
