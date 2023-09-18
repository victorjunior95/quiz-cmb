const BASE_URL = 'http://localhost:3001';

fetch(`${BASE_URL}/quiz`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao fazer a solicitação: ' + response.status);
    }
    return response.json(); // Ou response.text() para obter uma resposta de texto
  })
  .then(data => {
    // Faça algo com os dados recebidos
    // console.log(data);

    // Armazene os dados no localStorage aqui
    localStorage.setItem("perguntasCompletas", JSON.stringify(data));


    const mainDiv = document.querySelector('#page_usr');

    const quizLs = JSON.parse(localStorage.getItem("perguntasCompletas"));

    // console.log("retorno do local storage", quizLs.facil[0].alternativas);

    const { id, tema, pergunta, imagem, alternativas } = quizLs.facil[0];
    // console.log(`tema: ${tema}`, `pergunta: ${pergunta}`, `imagem: ${imagem}`, `alternativas: ${alternativas}`);

    createDivQuestion(id, tema, pergunta, alternativas, imagem, mainDiv);
  })
  .catch(error => {
    // Lida com erros de solicitação
    console.error('Erro na solicitação:', error);
  });

// console.log("retorno do local storage", quizLs);

// const page_usr = document.getElementById('page_usr');
// console.log(page_usr);

function createDivQuestion(id, tema, pergunta, alternativas, imagem, divAppend) {
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

    divAlternativas.appendChild(buttonAlternativa);
  }

  // Alternativa/botão selecionado


  buttonEnviar.textContent = 'Confirmar';
  buttonEnviar.type = 'submit';
  // buttonEnviar.value = ;
  // Função que compara a alternativa selecionada com a alternativa correta
  const resposta = JSON.parse(localStorage.getItem("perguntasCompletas")).facil[0].resposta;
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