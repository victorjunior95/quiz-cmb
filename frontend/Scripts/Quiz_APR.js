const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");
const questionTime = 30;

socket.emit('connectAPR', ROOMID);

let perguntaAtual;

function exibirPergunta(dificuldadeAtual) {
  let quizLs = JSON.parse(localStorage.getItem("perguntasCompletas"));
  const perguntasDaDificuldadeAtual = quizLs[dificuldadeAtual];

  const randomIndex = Math.floor(Math.random() * perguntasDaDificuldadeAtual.length);
  perguntaAtual = perguntasDaDificuldadeAtual[randomIndex];

  const roomId = localStorage.getItem("roomId");
  socket.emit('sendQuestion', perguntaAtual, roomId, questionTime);

  const mainDiv = document.querySelector('#page_apr');
  mainDiv.innerHTML = ""; // Limpe o conteúdo anterior

  createDivQuestion(perguntaAtual.id, perguntaAtual.tema, perguntaAtual.pergunta, perguntaAtual.alternativas, perguntaAtual.imgPergunta, mainDiv);

  let perguntasUsadasLS = localStorage.getItem("perguntasUsadas");

  if (perguntasUsadasLS === null) {
    const initArray = [perguntaAtual];
    localStorage.setItem("perguntasUsadas", JSON.stringify(initArray));

    quizLs[dificuldadeAtual] = quizLs[dificuldadeAtual].filter((object) => object.id !== perguntaAtual.id);
    localStorage.setItem("perguntasCompletas", JSON.stringify(quizLs));
  } else {
    const perguntasUsadasLSParsed = JSON.parse(perguntasUsadasLS);
    perguntasUsadasLSParsed.push(perguntaAtual);
    localStorage.setItem("perguntasUsadas", JSON.stringify(perguntasUsadasLSParsed));

    quizLs[dificuldadeAtual] = quizLs[dificuldadeAtual].filter((object) => object.id !== perguntaAtual.id);
    localStorage.setItem("perguntasCompletas", JSON.stringify(quizLs));
  }
}

const createClassification = (classification) => {
  const schoolList = document.getElementById('schoolList');
  classification.forEach((element) => {
    const classificationDiv = document.createElement('div');
    classificationDiv.className = 'classificationDiv';
    const classificationSpan = document.createElement('span');
    classificationSpan.className = 'classificationSpan';
    classificationSpan.textContent = element.schoolName;
    classificationSpan.id = element.schoolName;
    classificationDiv.appendChild(classificationSpan);
    schoolList.appendChild(classificationDiv);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const dificuldadeAtual = localStorage.getItem('actualLevel');
  // Para ativar o 'receiveTimer' precisa atualizar a dificuldade no 'rooms.js' que é feito no Loading.js (socket.emit('changeDifficulty'))

  if (dificuldadeAtual === 'facil') {
    socket.emit('clearConnections');
  }

  exibirPergunta(dificuldadeAtual);
  const answer = document.getElementById('botaoResposta');

  socket.on('receiveTimer', ({ questionTime, endTime }) => {
    iniciarTempoQuestao(questionTime);
    // conferir endtime - é o timestamp ("Date.now()") + o tempo da fase
    totalTimer(endTime);
  });
  
  socket.emit('requestClassification', ROOMID);

  socket.on('classification', (classification) => {
    createClassification(classification);
  });

  socket.on('schoolAnswered', (schoolName) => {
    const school = document.getElementById(schoolName);
    school.style.backgroundColor = "green";
  });

  answer.addEventListener('click', async () => {
    clearInterval(totalTimerInterval);
    window.location.href = "/pages/Answer_APR.html";
  });
});

function createDivQuestion(id, tema, pergunta, alternativas, imagem, divAppend) {
  const divPergunta = document.createElement('div');
  const divAlternativas = document.createElement('div');
  const divImagem = document.createElement('div');
  const textTema = document.createElement('h1');
  const textPergunta = document.createElement('text');

  textTema.textContent = tema;
  textTema.className = 'textTema';
  textPergunta.textContent = pergunta;
  textPergunta.className = 'textPergunta';
  textPergunta.id = id;

  for(let index = 0; index < alternativas.length; index++) {
    const element = alternativas[index];

    const textAlternativa = document.createElement('li');
    textAlternativa.id = element.slice(0, 1);
    textAlternativa.textContent = element;
    textAlternativa.value = element.slice(0, 1);
    textAlternativa.className = 'textAlternativa';

    divAlternativas.appendChild(textAlternativa);
    divAlternativas.className = 'divAlternativas';
  }

  divPergunta.appendChild(textTema);
  divPergunta.appendChild(textPergunta);
  if (imagem !== "") {
    const imgElement = document.createElement('img');
    imgElement.src = imagem;
    imgElement.className = 'imgElement';
    divImagem.appendChild(divAlternativas);
    divImagem.appendChild(imgElement);
    divPergunta.appendChild(imgElement);
  }
  divPergunta.className = 'divPergunta';
  divPergunta.classList.add("pergunta");
  divAlternativas.classList.add("alternativas");
  divAppend.appendChild(divPergunta);
  divAppend.appendChild(divAlternativas);
}

let questaoTimerInterval;

function iniciarTempoQuestao(newTime) {
  let questaoTimer = newTime;
  const ele = document.getElementById('questao-timer');
  ele.innerHTML = questaoTimer >= 10 ? questaoTimer : '0' + questaoTimer;

  clearInterval(questaoTimerInterval); // Limpe qualquer intervalo anterior
  questaoTimerInterval = setInterval(() => {
    ele.innerHTML = questaoTimer >= 10 ? questaoTimer : '0' + questaoTimer;
    questaoTimer--;

    if (questaoTimer < 0) {
      clearInterval(questaoTimerInterval);
      window.location.href = "/pages/Answer_APR.html";
    }
  }, 1000);
};

let totalTimerInterval;
function totalTimer(endTime) {
  // o endtime é fixo, setado em soket.game.setTime
  const actualTime = new Date().getTime();

  console.log(`endTime: ${endTime}, atualTime: ${actualTime}, dif:${endTime - actualTime}`);
  const timeLeft = Math.round((endTime - actualTime) / 1000);
  // Após a mudança de fase ele retorna negativo. Pq?
    // provavelmente não está mudando a fase no back-end, que deveria ocorrer em Loading.js (socket.emit('changeDifficulty'))
  console.log('timeleft', timeLeft);
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
      console.log('Sem função aqui pra não parar o jogo quando as pessoas podem escolher respostas.');
    }

    var hoursStr = hours.toString().padStart(2, '0');
    var minutesStr = minutes.toString().padStart(2, '0');
    var secondsStr = seconds.toString().padStart(2, '0');

    ele.innerHTML = hoursStr + ':' + minutesStr + ':' + secondsStr;
  }, 1000);
};
