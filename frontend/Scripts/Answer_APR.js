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
  
  for(let index = 0; index < alternativas.length; index++) {
    const element = alternativas[index];
    const isCorrect = element.slice(0,1) === resposta; 

    const textAlternativa = document.createElement('li');
    textAlternativa.id = element.slice(0,1);
    textAlternativa.textContent = element;
    textAlternativa.value = element.slice(0,1);
    if(isCorrect) {
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

const main = () => {
  socket.emit('connectAPRAnswer', ROOMID);

  const nextButton = document.getElementById("botaoAvancar");
  nextButton.addEventListener('click', () => {
    window.location.href = "/pages/Loading_APR.html";
  });
};

main();