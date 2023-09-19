const BASE_URL = 'http://localhost:3001';

// localStorage.setItem("perguntasUsadas", []);

fetch(`${BASE_URL}/quiz`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao fazer a solicitação: ' + response.status);
    }
    return response.json(); // Ou response.text() para obter uma resposta de texto
  })
  .then(data => {

    localStorage.setItem("perguntasCompletas", JSON.stringify(data));

    const mainDiv = document.querySelector('#page_usr');

    const quizLs = JSON.parse(localStorage.getItem("perguntasCompletas"));

    // console.log(typeof quizLs);

    const randomIndex = Math.floor(Math.random() * quizLs.facil.length);
    const { id, tema, pergunta, imagem, alternativas } = quizLs.facil[randomIndex];

    createDivQuestion(id, tema, pergunta, alternativas, imagem, mainDiv);
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
  // const buttonVoltar = document.createElement('button');
  // const buttonAvancar = document.createElement('button');

  // console.log(imagem);
  
  textTema.textContent = tema;
  textPergunta.textContent = pergunta;
  textPergunta.id = id;
  imgPergunta.src = imagem;  
  
  for(let index = 0; index < alternativas.length; index++) {
    const element = alternativas[index];
    
    // console.log(element);

    const textAlternativa = document.createElement('li');
    textAlternativa.id = element.slice(0,1);
    textAlternativa.textContent = element;
    textAlternativa.value = element.slice(0,1);

    divAlternativas.appendChild(textAlternativa);
  }

  // buttonVoltar.textContent = 'Voltar';
  // buttonVoltar.type = 'submit';
  // buttonVoltar.id = 'botaoVoltar';

  // buttonAvancar.textContent = 'Avançar';
  // buttonAvancar.type = 'submit';
  // buttonAvancar.id = 'botaoAvancar';

  divPergunta.appendChild(textTema);
  divPergunta.appendChild(textPergunta);
  divPergunta.appendChild(imgPergunta);
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