const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");
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
    socket.emit('sendQuestion', perguntaAtual, roomId);

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
  const avancar = document.getElementById('botaoAvancar');
  const answer = document.getElementById('botaoResposta');

  socket.emit('requestClassification', ROOMID);

  socket.on('classification', (classification) => {
    createClassification(classification);
  });

  socket.on('schoolAnswered', (schoolName) => {
    const school = document.getElementById(schoolName);
    school.style.backgroundColor = "green";
  });

  avancar.addEventListener('click', async () => {
    exibirPergunta();
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
  const imgPergunta = document.createElement('img');
  // const buttonVoltar = document.createElement('button');
  // const buttonAvancar = document.createElement('button');

  // console.log(imagem);
  
  textTema.textContent = tema;
  textTema.className = 'textTema';
  textPergunta.textContent = pergunta;
  textPergunta.className = 'textPergunta';
  textPergunta.id = id;
  imgPergunta.src = imagem;  
  
  for(let index = 0; index < alternativas.length; index++) {
    const element = alternativas[index];
    
    // console.log(element);

    const textAlternativa = document.createElement('li');
    textAlternativa.id = element.slice(0,1);
    textAlternativa.textContent = element;
    textAlternativa.value = element.slice(0,1);
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