const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const { roomId } = JSON.parse(localStorage.getItem("roomData"));
const alternativaSelecionada = localStorage.getItem("alternativaSelecionada");

const showAnswer = (question) => {
  const { id, tema, pergunta, alternativas, imgResposta, resposta, descricao } = question;

  const divAppend = document.getElementById('page_usr');
  const divPergunta = document.createElement('div');
  const divAlternativas = document.createElement('div');
  const divImagem = document.createElement('div');
  const textTema = document.createElement('h1');
  const textPergunta = document.createElement('text');
  const textDesc = document.createElement('text');
  
  const isCorrect = alternativaSelecionada === resposta;
  const textAlternativaCorreta = document.createElement('text');

  textTema.textContent = tema;
  textTema.className = 'textTema';
  textPergunta.textContent = pergunta;
  textPergunta.className = 'textPergunta';
  textPergunta.id = id;
  textDesc.textContent = descricao;
  textDesc.className = 'textDesc';
  
  textAlternativaCorreta.textContent = 'Alternativa Correta:';
  textAlternativaCorreta.className = 'textAlternativaCorreta';

  const divAcertoErro = document.getElementById('divAcertoErro');
  
  const answerStatus = document.createElement('div');
  answerStatus.className = 'answerStatus';

  if (isCorrect) {
    answerStatus.innerHTML = '&#10004;';
    answerStatus.style.color = 'white';
    answerStatus.style.backgroundColor = 'green';
    answerStatus.style.border = '8px solid white';
  } else {
    answerStatus.innerHTML = '&#10006;';
    answerStatus.style.color = 'white';
    answerStatus.style.backgroundColor = 'red';
    answerStatus.style.border = '8px solid white';
  }
  
  divAcertoErro.prepend(answerStatus);

  const correctAlternative = alternativas.find(element => element.slice(0, 1) === resposta);

  divAlternativas.appendChild(textAlternativaCorreta);

  if (correctAlternative) {
    const textAlternativa = document.createElement('li');
    textAlternativa.id = correctAlternative.slice(0, 1);
    textAlternativa.textContent = correctAlternative;
    textAlternativa.value = correctAlternative.slice(0, 1);
    textAlternativa.className = 'textAlternativa';
    textAlternativa.style.listStyleType = 'none';

    textAlternativa.style.backgroundColor = "#0AABBA";
    textAlternativa.style.color = "white";

    divAlternativas.appendChild(textAlternativa);
  }

  divAppend.appendChild(divAlternativas);

  divPergunta.appendChild(textDesc);

  if (imgResposta !== "") {
    const imgElement = document.createElement('img');
    imgElement.src = imgResposta;
    divImagem.appendChild(imgElement);
    divPergunta.appendChild(imgElement);
  }

  divPergunta.classList.add('divPergunta');
  divAlternativas.classList.add('divAlternativas');
  divAppend.appendChild(divPergunta);
}

socket.on('receiveQuestion', (question) => {
  showAnswer(question);
});

socket.on('gameStarted', () => {
  window.location.href = "/pages/Quiz_USR.html";
});

socket.on('getClassification', () => {
  window.location.href = "/pages/Classification_USR.html";
});

const main = () => {
  socket.emit('connectAnswer', roomId);
};

main();