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
    classificationDiv.textContent = element.schoolName;
    const classificationSpan = document.createElement('span');
    classificationSpan.className = 'classificationSpan';
    classificationSpan.id = element.schoolName;
    classificationDiv.appendChild(classificationSpan);
    schoolList.appendChild(classificationDiv);
  });
};

const nameExisted = (list, name) => {
  return list.indexOf(name) !== -1;
}

const addNameList = (name) => {
  // Verificar se o nome já existe na lista
  const listSchool = JSON.parse(localStorage.getItem('listSchool')) || [];
  
  if (!nameExisted(listSchool, name)) {
    // Adicionar o nome à lista
    listSchool.push(name);
    // Salvar a lista atualizada no localStorage
    localStorage.setItem('listSchool', JSON.stringify(listSchool));
  } else {
    console.log(`Nome "${name}" já existe na lista e será ignorado.`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  localStorage.setItem('listSchool', JSON.stringify([]));
  let dificuldadeAtual = localStorage.getItem('actualLevel');
  
  if (!dificuldadeAtual) {
    localStorage.setItem('actualLevel', 'facil');
    dificuldadeAtual = 'facil';
  }

  if (dificuldadeAtual === 'facil') {
    socket.emit('clearConnections');
  }

  exibirPergunta(dificuldadeAtual);
  const answer = document.getElementById('botaoResposta');

  socket.on('receiveTimer', ({ questionTime, endTime }) => {
    initTimeQuestion(questionTime);
    totalTimer(endTime);
  });
  
  // Aparentemente sem uso - conferir com o time
  socket.emit('requestClassification', ROOMID);

  socket.on('classification', (classification) => {
    createClassification(classification);
  });

  socket.on('schoolAnswered', (schoolName) => {
    const school = document.getElementById(schoolName);
    school.style.display = "block";

    addNameList(schoolName);

    const getListSchoolAnswered = JSON.parse(localStorage.getItem('listSchool'));
    const usersLength = Number(localStorage.getItem('usersLength'));

    if (getListSchoolAnswered.length === Number(usersLength)) {
      window.location.href = "/pages/Answer_APR.html";
    }
  });

  answer.addEventListener('click', async () => {
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
      // Redireciona para a página desejada quando o tempo acabar
      window.location.href = "/pages/Answer_APR.html";
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
};

function totalTimer(endTime) {
  const { time } = endTime;

  const counter = document.getElementById("counter");
  const storageTime = JSON.parse(localStorage.getItem('currentTime'));
  const getCurrentTime = storageTime?.started ? storageTime.time : time;

  var timeInMilliseconds = getCurrentTime;

    // Função para atualizar a contagem regressiva
    function updateCountDown() {
      var minutesRemaining = Math.floor(timeInMilliseconds / 60000);
      var secondsRemaining = Math.floor((timeInMilliseconds % 60000) / 1000);

      // Formate os minutos e segundos para exibição
      var formattedMinutes = minutesRemaining < 10 ? "0" + minutesRemaining : minutesRemaining;
      var formattedSeconds = secondsRemaining < 10 ? "0" + secondsRemaining : secondsRemaining;

      // Exiba a contagem regressiva na div com id "contador"
      counter.innerHTML = formattedMinutes + ":" + formattedSeconds;

      // Reduza o tempo em milissegundos em 1 segundo (1000 milissegundos)
      timeInMilliseconds -= 1000;

      localStorage.setItem("currentTime", JSON.stringify({ started: true, time: timeInMilliseconds}));

      // Verifique se a contagem regressiva chegou a zero
      if (timeInMilliseconds < 0) {
        clearInterval(intervalo);
        counter.innerHTML = "Tempo esgotado!";
      }
    }

    // Chame a função de atualização a cada segundo (1000 milissegundos)
    var interval = setInterval(updateCountDown, 1000);

    // Inicialize a contagem regressiva
    updateCountDown();
};
