const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);

// 1) Perguntas
fetch(`${BASE_URL}/quiz`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao fazer a solicitação: ' + response.status);
    }
    return response.json(); // Ou response.text() para obter uma resposta de texto
  })
  .then(data => {
    localStorage.setItem("perguntasCompletas", JSON.stringify(data));
    exibirPergunta();
  })
  .catch(error => {
    console.error('Erro na solicitação:', error);
  });

let perguntaAtual;
let dificuldadeAtual = "facil"; // Comece com a dificuldade "facil"

function exibirPergunta() {
  let quizLs = JSON.parse(localStorage.getItem("perguntasCompletas"));
  const perguntasDaDificuldadeAtual = quizLs[dificuldadeAtual];

  const randomIndex = Math.floor(Math.random() * perguntasDaDificuldadeAtual.length);
  perguntaAtual = perguntasDaDificuldadeAtual[randomIndex];

  const mainDiv = document.querySelector('#page_apr');
  mainDiv.innerHTML = ""; // Limpe o conteúdo anterior
  
  createDivQuestion(perguntaAtual.id, perguntaAtual.tema, perguntaAtual.pergunta, perguntaAtual.alternativas, perguntaAtual.img_pergunta, mainDiv);

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
  
document.addEventListener('DOMContentLoaded', () => {
  const avancar = document.getElementById('botaoAvancar');

  avancar.addEventListener('click', async () => {
    exibirPergunta();
  });
}); 

function createDivQuestion(id, tema, pergunta, alternativas, imagem, divAppend) {
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

    const textAlternativa = document.createElement('li');
    textAlternativa.id = element.slice(0,1);
    textAlternativa.textContent = element;
    textAlternativa.value = element.slice(0,1);

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

// colocar tempo da pergunta
// quando acabar o tempo, direcionar para a pagina da resposta
// na pagina de resposta é que o botao avançar tem que funcionar, direcionando para uma nova pergunta
// Resposta_APR

// 2) Classificação
// Quando a página é carregada, você pode emitir um evento ou fazer outras ações
document.addEventListener('DOMContentLoaded', () => {
  // Por exemplo, você pode emitir um evento para solicitar a classificação atual
  socket.emit('requestClassification', socket);

  // Ou você pode lidar com eventos recebidos do servidor
  socket.on('classification', (classification) => {
    console.log(classification);
    // Atualize a interface com a nova classificação
    // const classificacaoDiv = document.getElementById('classificacao');

    // Faça o que for necessário para renderizar a classificação na página
    // Por exemplo, você pode criar elementos HTML e adicioná-los à div 'classificacao'
  });

  socket.on('classificationError', (error) => {
    // Lide com erros aqui
    console.error('Erro na classificação:', error.message);
  });
});


// 3) Listagem de usuários e a marcação se já responderam
fetch(`${BASE_URL}/users`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao fazer a solicitação: ' + response.status);
    }
    return response.json(); // Ou response.text() para obter uma resposta de texto
  })
  .then(data => localStorage.setItem("usuarios", JSON.stringify(data)))
  .catch(error => {
    console.error('Erro na solicitação:', error);
  });

const mainDiv = document.querySelector('#usuarios');

const usersList = JSON.parse(localStorage.getItem("usuarios"));

const imgUserURL = 'https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png'

createDivUsers(usersList, imgUserURL, mainDiv);

function createDivUsers(usuarios, imagem, divAppend) {
  
  for(let index = 0; index < usuarios.length; index++) {
    const element = usuarios[index];
    
    const divUser = document.createElement('div');
    const textName = document.createElement('h2');
    // Aqui abrigará uma imagem padrão
    const imgUser = document.createElement('img');

    textName.textContent = element.name;
    imgUser.src = imagem;
    // alteração no 'style' provisório
    imgUser.style = "width: 30px;"

    divUser.appendChild(textName);
    divUser.appendChild(imgUser);
    divAppend.appendChild(divUser);
  };
};

// Falta acrescentar o recurso que add o ícone que corresponde a assinalar o usuário que já respondeu a pergunta