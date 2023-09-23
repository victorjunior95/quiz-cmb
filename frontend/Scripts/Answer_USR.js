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
    const isSelect = element.slice(0, 1) === alternativaSelecionada;

    const textAlternativa = document.createElement('li');
    textAlternativa.id = element.slice(0, 1);
    textAlternativa.textContent = element;
    textAlternativa.value = element.slice(0,1);
    textAlternativa.className = 'textAlternativa';
    textAlternativa.style.listStyleType = 'none';

    if (isCorrect) {
      textAlternativa.style.backgroundColor = "green";
      textAlternativa.style.color = "white";
    }

    if (isSelect) {
      const iconSelect = document.createElement('span');
      iconSelect.textContent = "X";
      textAlternativa.appendChild(iconSelect);
    }

    divAlternativas.appendChild(textAlternativa);
    localStorage.removeItem("alternativaSelecionada");
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

socket.on('receiveQuestion', (question) => {
  showAnswer(question);
});

socket.on('gameStarted', () => {
  window.location.href = "/pages/Quiz_USR.html";
});

// Estaria sem utilidade, pois a classificação só aparece para o apresentador ou é usada para direcionar para a página de classificação (o mais provável)?
socket.on('getClassification', () => {
  window.location.href = "/pages/Classification_USR.html";
});

const main = () => {
  socket.emit('connectAnswer', roomId);
};

main();
