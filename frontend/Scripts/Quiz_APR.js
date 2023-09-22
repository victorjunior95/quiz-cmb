const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");
const questionTime = 30;
// localStorage.setItem("perguntasUsadas", []);

socket.emit('connectAPR', ROOMID);

let perguntaAtual;
let dificuldadeAtual = "facil"; // Comece com a dificuldade "facil"

function exibirPergunta() {
  let quizLs = JSON.parse(localStorage.getItem("perguntasCompletas"));
  const perguntasDaDificuldadeAtual = quizLs[dificuldadeAtual];

  const randomIndex = Math.floor(Math.random() * perguntasDaDificuldadeAtual.length);
  perguntaAtual = perguntasDaDificuldadeAtual[randomIndex];

  const roomId = localStorage.getItem("roomId");
  socket.emit('sendQuestion', perguntaAtual, roomId, questionTime);

  const mainDiv = document.querySelector('#page_usr');
  mainDiv.innerHTML = ""; // Limpe o conteúdo anterior

  createDivQuestion(perguntaAtual.id, perguntaAtual.tema, perguntaAtual.pergunta, perguntaAtual.alternativas, perguntaAtual.imagem, mainDiv);

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
  socket.emit('clearConnections');
  exibirPergunta();
  const answer = document.getElementById('botaoResposta');

  socket.emit('requestClassification', ROOMID);

  socket.on('classification', (classification) => {
    createClassification(classification);
  });

  socket.on('schoolAnswered', (schoolName) => {
    const school = document.getElementById(schoolName);
    school.style.backgroundColor = "green";
  });

  socket.on('receiveTimer', ({ questionTime, endTime }) => {
    console.log('Quiz_APR', questionTime)
    iniciarTempoQuestao(questionTime);
    totalTimer(endTime);
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
  const imgPergunta = document.createElement('img');
  // const buttonVoltar = document.createElement('button');
  // const buttonAvancar = document.createElement('button');

  textTema.textContent = tema;
  textTema.className = 'textTema';
  textPergunta.textContent = pergunta;
  textPergunta.className = 'textPergunta';
  textPergunta.id = id;
  imgPergunta.src = imagem;

  for (let index = 0; index < alternativas.length; index++) {
    const element = alternativas[index];

    // console.log(element);

    const textAlternativa = document.createElement('li');
    textAlternativa.id = element.slice(0, 1);
    textAlternativa.textContent = element;
    textAlternativa.value = element.slice(0, 1);
    textAlternativa.className = 'textAlternativa';

    divAlternativas.appendChild(textAlternativa);
    divAlternativas.className = 'divAlternativas';
  }

  // buttonVoltar.textContent = 'Voltar';
  // buttonVoltar.type = 'submit';
  // buttonVoltar.id = 'botaoVoltar';

  // buttonAvancar.textContent = 'Avançar';
  // buttonAvancar.type = 'submit';
  // buttonAvancar.id = 'botaoAvancar';

  divImagem.appendChild(divAlternativas);
  divImagem.appendChild(imgPergunta);

  divPergunta.appendChild(textTema);
  divPergunta.appendChild(textPergunta);
  // divPergunta.appendChild(imgPergunta);
  divPergunta.className = 'divPergunta';
  divPergunta.classList.add("pergunta");
  divAlternativas.classList.add("alternativas");
  divAppend.appendChild(divPergunta);
  divAppend.appendChild(divAlternativas);
  // divAppend.appendChild(buttonVoltar);
  // divAppend.appendChild(buttonAvancar);
  // divAppend.appendChild(divPai);
  // divPai.classList.add("pergunta");
}

// colocar tempo da pergunta
// quando acabar o tempo, direcionar para a pagina da resposta
// na pagina de resposta é que o botao avançar tem que funcionar, direcionando para uma nova pergunta
// Resposta_APR

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
      console.log('Sem função aqui pra não parar o jogo quando as pessoas podem escolher respostas.');
    }

    var hoursStr = hours.toString().padStart(2, '0');
    var minutesStr = minutes.toString().padStart(2, '0');
    var secondsStr = seconds.toString().padStart(2, '0');
    ele.innerHTML = hoursStr + ':' + minutesStr + ':' + secondsStr;
  }, 1000);
};
