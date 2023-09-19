const BASE_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('sendButton');
  
  sendButton.addEventListener('click', async () => {
    try {
      const inputElement = document.getElementById('textInput');
      const inputValue = inputElement.value;
  
      if (inputValue === "") {
        alert("Por favor, informe o nome de sua escola!");
        return;
      }

      // Dados a serem enviados para o servidor
      const data = {
        user: inputValue
      };
      
      // Enviando a requisição POST para o backend usando a Fetch API
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Resposta do servidor:', result);
    
      window.location.href = "../pages/loading.html";
      alert(`Bem-vindo, ${escola}!`);

    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  });
});