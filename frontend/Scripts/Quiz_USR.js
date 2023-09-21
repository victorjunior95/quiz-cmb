const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);

const data = JSON.parse(localStorage.getItem("roomData"));
socket.emit('enterRoom', data.roomId, data.user);

socket.on('receiveQuestion', (question) => {
  console.log(question);
  const mainDiv = document.querySelector('#page_usr');
  mainDiv.innerHTML = ""; // Limpe o conteúdo anterior
  createDivQuestion(question, mainDiv);
});

socket.on('getAnswer', () => {
  window.location.href = "/pages/Answer_USR.html";
});

function createDivQuestion(question, divAppend) {
  const { id, tema, pergunta, alternativas, imagem } = question;

  const divPergunta = document.createElement('div');
  const divAlternativas = document.createElement('div');
  const textTema = document.createElement('h1');
  const textPergunta = document.createElement('text');
  const imgPergunta = document.createElement('img');
  const buttonEnviar = document.createElement('button');
  
  textTema.textContent = tema;
  textPergunta.textContent = pergunta;
  textPergunta.id = id;
  imgPergunta.src = imagem;  
  
  for(let index = 0; index < alternativas.length; index++) {
    const element = alternativas[index];

    const buttonAlternativa = document.createElement('button');
    buttonAlternativa.id = element.slice(0,1);
    buttonAlternativa.textContent = element;
    buttonAlternativa.value = element.slice(0,1);
    buttonAlternativa.addEventListener('click', () => {
      buttonAlternativa.style.backgroundColor = "green";
      localStorage.setItem("alternativaSelecionada", buttonAlternativa.value);
    });

    divAlternativas.appendChild(buttonAlternativa);
  }

  buttonEnviar.textContent = 'Confirmar';
  buttonEnviar.type = 'submit';
  buttonEnviar.addEventListener('click', () => {
    const selectAnswer = localStorage.getItem("alternativaSelecionada");
    socket.emit('receiveAnswer', { answer: selectAnswer, roomId: data.roomId, question, schoolName: data.user  });
  });

  divPergunta.appendChild(textTema);
  divPergunta.appendChild(textPergunta);
  divPergunta.appendChild(imgPergunta);
  divPergunta.classList.add("pergunta");
  divAlternativas.classList.add("alternativas");
  divAppend.appendChild(divPergunta);
  divAppend.appendChild(divAlternativas);
  divAppend.appendChild(buttonEnviar);
}