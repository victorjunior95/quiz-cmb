const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);

const data = JSON.parse(localStorage.getItem("roomData"));
socket.emit('enterRoom', data.roomId, data.user);

socket.on('receiveQuestion', (question) => {
  console.log(question);
  const mainDiv = document.querySelector('#page_usr');
  mainDiv.innerHTML = ""; // Limpe o conteúdo anterior
  createDivQuestion(question, mainDiv);
});

function createDivQuestion(question, divAppend) {
  const { id, tema, pergunta, alternativas, imagem } = question;

  const divPergunta = document.createElement('div');
  const divAlternativas = document.createElement('div');
  const textTema = document.createElement('h1');
  const textPergunta = document.createElement('text');
  const imgPergunta = document.createElement('img');
  const buttonEnviar = document.createElement('button');

  // console.log(imagem);
  
  textTema.textContent = tema;
  textPergunta.textContent = pergunta;
  textPergunta.id = id;
  imgPergunta.src = imagem;  
  
  for(let index = 0; index < alternativas.length; index++) {
    const element = alternativas[index];
    
    // console.log(element);

    const buttonAlternativa = document.createElement('button');
    buttonAlternativa.id = element.slice(0,1);
    buttonAlternativa.textContent = element;
    buttonAlternativa.value = element.slice(0,1);
    buttonAlternativa.addEventListener('click', () => {
      buttonAlternativa.style.backgroundColor = "green";
      localStorage.setItem("alternativaSelecionada", JSON.stringify(buttonAlternativa.value));
    });

    divAlternativas.appendChild(buttonAlternativa);
  }

  // Alternativa/botão selecionado


  buttonEnviar.textContent = 'Confirmar';
  buttonEnviar.type = 'submit';
  buttonEnviar.addEventListener('click', () => {
    const selectAnswer = JSON.parse(localStorage.getItem("alternativaSelecionada"));
    socket.emit('sendAnswer', { answer: selectAnswer, roomId: data.roomId, question  });
  });
  // buttonEnviar.value = ;
  // Função que compara a alternativa selecionada com a alternativa correta
  // console.log(resposta);


  divPergunta.appendChild(textTema);
  divPergunta.appendChild(textPergunta);
  divPergunta.appendChild(imgPergunta);
  divPergunta.classList.add("pergunta");
  divAlternativas.classList.add("alternativas");
  divAppend.appendChild(divPergunta);
  divAppend.appendChild(divAlternativas);
  divAppend.appendChild(buttonEnviar);
  // divAppend.appendChild(divPai);

  // divPai.classList.add("pergunta");
}

// Linha 24 (localStorage.getItem())
// Criar uma função que rendererize uma pergunta aleatória de acordo com a fase
// Criar uma função que retire a pergunta já utilizada, passando para uma chave no localStorage.
// O botão avançar ativa as funções acima, gerando uma nova pergunta