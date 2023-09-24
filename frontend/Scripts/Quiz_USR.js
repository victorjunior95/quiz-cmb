const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);

const data = JSON.parse(localStorage.getItem("roomData"));
socket.emit('enterRoom', data.roomId, data.user);

socket.on('receiveQuestion', (question) => {
  const mainDiv = document.querySelector('#page_usr');
  mainDiv.innerHTML = ""; // Limpe o conteúdo anterior
  createDivQuestion(question, mainDiv);
});

socket.on('getAnswer', () => {
  window.location.href = "/pages/Answer_USR.html";
});

socket.on('receiveTimer', (questionTime) => {
  initTimeQuestion(questionTime);
})
let questionAtual;
let answerSent = false;

function createDivQuestion(question, divAppend) {
  answerSent = false;
  questionAtual = question;
  const { id, tema, pergunta, alternativas, imgPergunta } = question;

  const divPergunta = document.createElement('div');
  const divAlternativas = document.createElement('div');
  const textTema = document.createElement('h1');
  const textPergunta = document.createElement('text');

  const buttonEnviar = document.createElement('button');

  textTema.textContent = tema;
  textTema.className = 'textTema';
  textPergunta.textContent = pergunta;
  textPergunta.id = id;
  textPergunta.className = 'textPergunta';

  for (let index = 0; index < alternativas.length; index++) {
    const element = alternativas[index];

    const buttonAlternativa = document.createElement('button');
    buttonAlternativa.id = element.slice(0, 1);
    buttonAlternativa.className = 'buttonAlternativa';
    buttonAlternativa.textContent = element;
    buttonAlternativa.value = element.slice(0, 1);
    buttonAlternativa.addEventListener('click', () => {
      localStorage.setItem("alternativaSelecionada", buttonAlternativa.value);
    });

    divAlternativas.appendChild(buttonAlternativa);
    divAlternativas.className = 'divAlternativas';
  }

  buttonEnviar.textContent = 'Confirmar';
  buttonEnviar.className = 'buttonEnviar';
  buttonEnviar.type = 'submit';
  buttonEnviar.addEventListener('click', () => {
    const selectAnswer = localStorage.getItem("alternativaSelecionada");
    answerSent = true;
    socket.emit('receiveAnswer', { answer: selectAnswer, roomId: data.roomId, question, schoolName: data.user });
  });

  divPergunta.appendChild(textTema);
  divPergunta.appendChild(textPergunta);

  if (imgPergunta !== "") {
    const imgElement = document.createElement('img');
    imgElement.src = imgPergunta;
    imgElement.className = 'imgElement';
    divPergunta.appendChild(imgElement);
  }

  divPergunta.classList.add("pergunta");
  divAlternativas.classList.add("alternativas");
  divAppend.appendChild(divPergunta);
  divAppend.appendChild(divAlternativas);
  divAppend.appendChild(buttonEnviar);
}

let questaoTimerInterval;

function initTimeQuestion(questionTime) {
    // Busca elemento HTML para renderizar timer
    const questionTimeEle = document.getElementById('question-time');

    // Inicializa o contador com o tempo fornecido em segundos
    let remainingTime = questionTime;
  
    // Função para atualizar o contador na tela
    function updateTimer() {
      // Renderiza o tempo restante na tela
      questionTimeEle.textContent = remainingTime >= 10 ? remainingTime : '0' + remainingTime;
  
      // Reduz o tempo em 1 segundo
      remainingTime--;
  
      if (remainingTime <= 0) {
        clearInterval(questaoTimerInterval);
        const allButtons = document.querySelectorAll('.divAlternativas > button');
        allButtons.forEach(btn => btn.disabled = true);
        if (!answerSent) {
          socket.emit('receiveAnswer', { answer: '', roomId: data.roomId, question: questionAtual, schoolName: data.user });
        }
      }
    }
  
    // Chama a função inicialmente para exibir o tempo inicial
    updateTimer();
  
    // Define um intervalo para atualizar o contador a cada segundo
    const timerInterval = setInterval(updateTimer, 1000);
  
    // Certifique-se de parar o intervalo quando o tempo acabar ou quando necessário
    if (remainingTime < 0) {
      clearInterval(timerInterval);
    }
}
