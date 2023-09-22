const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");

const showAnswer = (question) => {
  const { id, tema, pergunta, alternativas, imgResposta, resposta, descricao } = question;

  const divAppend = document.getElementById('page_apr');
  const divPergunta = document.createElement('div');
  const divAlternativas = document.createElement('div');
  const divImagem = document.createElement('div');
  const textTema = document.createElement('h1');
  const textPergunta = document.createElement('text');
  const textDesc = document.createElement('text');
  
  textTema.textContent = tema;
  textTema.className = 'textTema';
  textPergunta.textContent = pergunta;
  textPergunta.className = 'textPergunta';
  textPergunta.id = id;
  textDesc.textContent = descricao;
  textDesc.className = 'textDesc';

  
  for(let index = 0; index < alternativas.length; index++) {
    const element = alternativas[index];
    const isCorrect = element.slice(0, 1) === resposta;

    const textAlternativa = document.createElement('li');
    textAlternativa.id = element.slice(0, 1);
    textAlternativa.textContent = element;
    textAlternativa.value = element.slice(0,1);
    textAlternativa.className = 'textAlternativa';
    textAlternativa.style.listStyleType = 'none';
    
    if(isCorrect) {
      // Uma opção de estilização é aumentar a div da correta e diminuir as demais
      textAlternativa.style.backgroundColor = "green";
      textAlternativa.style.color = "white";
    }

    divAlternativas.appendChild(textAlternativa);
  }
  
  divPergunta.appendChild(textTema);
  divPergunta.appendChild(textPergunta);
  divPergunta.appendChild(textDesc);
  // divAlternativas.appendChild(textDesc);
  if (imgResposta !== "") {
    const imgElement = document.createElement('img');
    imgElement.src = imgResposta;  
    divImagem.appendChild(divAlternativas);
    divImagem.appendChild(imgElement);
    divPergunta.appendChild(imgElement);
  }
  divPergunta.classList.add("divPergunta");
  divAlternativas.classList.add("divAlternativas");
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

    if (document.getElementById('total-timer').getAttribute('aria-timer') <= 0) {
      let currentLevel = localStorage.getItem('actualLevel')
      let newLevel = currentLevel === 'facil' ? 'medio' : 'dificil';

      localStorage.setItem('actualLevel', newLevel)
      socket.emit('sendLevel', newLevel);

      
    }

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
      nextButtonLink = "/pages/Classification_APR.html";
      console.log('Função de ir pra página de troca de dificuldade', nextButtonLink);
    }

    var hoursStr = hours.toString().padStart(2, '0');
    var minutesStr = minutes.toString().padStart(2, '0');
    var secondsStr = seconds.toString().padStart(2, '0');

    ele.setAttribute('aria-timer', endTime - new Date().getTime())
    ele.innerHTML = hoursStr + ':' + minutesStr + ':' + secondsStr;
  }, 1000);
};
