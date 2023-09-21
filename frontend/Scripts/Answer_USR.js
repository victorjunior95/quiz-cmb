const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const { roomId } = JSON.parse(localStorage.getItem("roomData"));
const alternativaSelecionada = localStorage.getItem("alternativaSelecionada");

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
  
  for(let index = 0; index < alternativas.length; index++) {
    const element = alternativas[index];
    const isCorrect = element.slice(0,1) === resposta;
    const isSelect = element.slice(0,1) === alternativaSelecionada;

    const textAlternativa = document.createElement('li');
    textAlternativa.id = element.slice(0,1);
    textAlternativa.textContent = element;
    textAlternativa.value = element.slice(0,1);

    if(isCorrect) {
      textAlternativa.style.backgroundColor = "green";
    }

    console.log(isSelect, element.slice(0,1), alternativaSelecionada);
    if(isSelect) {
      const iconSelect = document.createElement('span');
      iconSelect.textContent = "X";
      textAlternativa.appendChild(iconSelect);
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

socket.on('receiveQuestion', (question) => {
  showAnswer(question);
});

socket.on('gameStarted', () => {
  window.location.href = "/pages/Quiz_USR.html";
});

const main = () => {
  socket.emit('connectAnswer', roomId);
};

main();