const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");

const showAnswer = (question) => {
  const { id, tema, pergunta, alternativas, imagem, resposta } = question;

  const divAppend = document.getElementById('page_usr');
  const divPergunta = document.createElement('div');
  const divAlternativas = document.createElement('div');
  const textTema = document.createElement('h1');
  const textPergunta = document.createElement('text');
  const imgPergunta = document.createElement('img');

  textTema.textContent = tema;
  textPergunta.textContent = pergunta;
  textPergunta.id = id;
  imgPergunta.src = imagem;

  for (let index = 0; index < alternativas.length; index++) {
    const element = alternativas[index];
    const isCorrect = element.slice(0, 1) === resposta;

    const textAlternativa = document.createElement('li');
    textAlternativa.id = element.slice(0, 1);
    textAlternativa.textContent = element;
    textAlternativa.value = element.slice(0, 1);
    if (isCorrect) {
      textAlternativa.style.backgroundColor = "green";
    }

    divAlternativas.appendChild(textAlternativa);
  }

  divPergunta.appendChild(textTema);
  divPergunta.appendChild(textPergunta);
  divPergunta.appendChild(imgPergunta);
  divPergunta.classList.add("pergunta");
  divAlternativas.classList.add("alternativas");
  divAppend.appendChild(divPergunta);
  divAppend.appendChild(divAlternativas);
}

socket.on('showAnswer', (question) => {
  document.getElementById("loading").remove();
  showAnswer(question);
  socket.emit('sendQuestion', question, ROOMID);
});

socket.on('receiveTimer', ({ endTime }) => {
  totalTimer(endTime);
});

let nextButtonLink = "/pages/Loading_APR.html";

const main = () => {
  socket.emit('connectAPRAnswer', ROOMID);

  const nextButton = document.getElementById("botaoAvancar");
  nextButton.addEventListener('click', () => {
    clearInterval(totalTimerInterval);
    console.log('Answer');
    window.location.href = nextButtonLink;
  });

  const classificationButton = document.getElementById("botaoClassificacao");
  classificationButton.addEventListener('click', () => {
    clearInterval(totalTimerInterval);
    console.log('AnswerClass');
    window.location.href = "/pages/Classification_APR.html";
  });
};

main();

let totalTimerInterval;
function totalTimer(endTime) {
  const actualTime = new Date().getTime();
  const timeLeft = Math.round((endTime - actualTime) / 1000);
  var hours = 0;
  var minutes = Math.floor(timeLeft / 60);
  var seconds = timeLeft % 60;
  var ele = document.getElementById('total-timer');
  var totalTimerInterval = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        hours--;
        minutes = 59;
      } else {
        minutes--;
      }
      seconds = 59;
    } else {
      seconds--;
    }

    hours < 0 ? hours = 0 : hours;
    minutes < 0 ? minutes = 0 : minutes;
    seconds < 0 ? seconds = 0 : seconds;

    if (hours === 0 && minutes === 0 && seconds === 0) {
      clearInterval(totalTimerInterval);
      nextButtonLink = "/pages/ChangeDifficulty.html";
      console.log('Função de ir pra página de troca de dificuldade', nextButtonLink);
    }

    var hoursStr = hours.toString().padStart(2, '0');
    var minutesStr = minutes.toString().padStart(2, '0');
    var secondsStr = seconds.toString().padStart(2, '0');

    ele.innerHTML = hoursStr + ':' + minutesStr + ':' + secondsStr;
  }, 1000);
};
