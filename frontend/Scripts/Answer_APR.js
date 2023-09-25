const BASE_URL = 'https://quiz-cmb-production-e86e.up.railway.app';
const socket = io(BASE_URL);
let currentLevel = localStorage.getItem("actualLevel");
const storageTime = JSON.parse(localStorage.getItem('currentTime'));
const ROOMID = localStorage.getItem("roomId");

const showAnswer = (question) => {
  const { id, tema, pergunta, alternativas, imgResposta, resposta, descricao } = question;

  const divAppend = document.getElementById("page_apr");
  const divPergunta = document.createElement("div");
  const divAlternativas = document.createElement("div");
  const divImagem = document.createElement("div");
  const textTema = document.createElement("h1");
  const textPergunta = document.createElement("text");
  const textDesc = document.createElement("text");

  const textRespostaCorreta = document.createElement("text");
  textRespostaCorreta.textContent = "Resposta correta:";
  textRespostaCorreta.className = "textRespostaCorreta";

  textTema.textContent = tema;
  textTema.className = "textTema";
  textPergunta.textContent = pergunta;
  textPergunta.className = "textPergunta";
  textPergunta.id = id;
  textDesc.textContent = descricao;
  textDesc.className = "textDesc";

  divAlternativas.classList.add("divAlternativas");

  // Encontre a alternativa correta
  const correctAlternative = alternativas.find((alternative) => alternative.slice(0, 1) === resposta);

  if (correctAlternative) {
    const textAlternativa = document.createElement("li");
    textAlternativa.id = correctAlternative.slice(0, 1);
    textAlternativa.textContent = correctAlternative;
    textAlternativa.value = correctAlternative.slice(0, 1);
    textAlternativa.className = "textAlternativa";
    textAlternativa.style.listStyleType = "none";
    textAlternativa.style.backgroundColor = "green";
    textAlternativa.style.border = "green";
    textAlternativa.style.color = "white";
    divAlternativas.appendChild(textAlternativa);
  }

  divPergunta.appendChild(textTema);

  divPergunta.appendChild(textRespostaCorreta);

  if (correctAlternative) {
    divPergunta.appendChild(divAlternativas);
  }

  divPergunta.appendChild(textDesc);

  if (imgResposta !== "") {
    const imgElement = document.createElement("img");
    imgElement.src = imgResposta;
    divImagem.appendChild(imgElement);
    divPergunta.appendChild(imgElement);
  }

  divPergunta.classList.add("divPergunta");
  divAppend.appendChild(divPergunta);
};  

socket.on("showAnswer", (question) => {
  document.getElementById("loading")?.remove();
  showAnswer(question);
  socket.emit("sendQuestion", question, ROOMID);
});

socket.on("receiveTotalTimer", () => {
  totalTimer();
});

let nextButtonLink = "/pages/Loading_APR.html";
const classificationLink = "/pages/Classification_APR.html";

const main = () => {
  socket.emit("connectAPRAnswer", ROOMID);

  const nextButton = document.getElementById("botaoAvancar");
  const finalizeQuizTitleDiv = document.getElementById("loading");

  const completedAnswers = JSON.parse(
    localStorage.getItem("perguntasCompletas")
  );

  const isLastDifficultyCompleted = !completedAnswers['dificil']?.length

  if(isLastDifficultyCompleted) {
    
    nextButton.innerHTML = "Avançar";

    nextButton.addEventListener('click', () => {
      const divAppend = document.getElementById("page_apr");
      divAppend.style.display = "none";

      const finalizeQuizTitle = document.createElement("h1")
      finalizeQuizTitle.textContent = "Parabéns por chegar até o final!"
      finalizeQuizTitleDiv.appendChild(finalizeQuizTitle);

      nextButton.innerHTML = "Classificação final";
      nextButton.addEventListener('click', () => {
        window.location.href = classificationLink;
      })
    })
  }

  const updateLevelIfTimeOrQuestionsAreEmpty = () => {
    
    const currentTime = JSON.parse(localStorage.getItem("currentTime"));
    const isCurrentLevelCompleted = !completedAnswers[currentLevel]?.length;

    localStorage.setItem(
      "changeDifficulty",
      JSON.stringify({ hasChangedLastAnswer: false })
    );
    if (currentTime.time <= 0 || isCurrentLevelCompleted) {
      localStorage.setItem(`${currentLevel}`, "acabou");

      let newLevel = currentLevel === "facil" ? "media" : "dificil";

      localStorage.setItem("actualLevel", newLevel);
      localStorage.setItem(
        "currentTime",
        JSON.stringify({ started: false, time: 0 })
      );
      localStorage.setItem(
        "changeDifficulty",
        JSON.stringify({ hasChangedLastAnswer: true })
      );

      window.location.href = classificationLink;
    } else {
      window.location.href = nextButtonLink;
    }
  }

  nextButton.addEventListener("click", () => {
    const getCurrentTime = storageTime.time;

    if (getCurrentTime <= 0) {
      window.location.href = classificationLink;
    } else {
      updateLevelIfTimeOrQuestionsAreEmpty();
    }
  });
};

main();

let totalTimerInterval;

function totalTimer() {
  const counter = document.getElementById("counter");
  const storageTime = JSON.parse(localStorage.getItem('currentTime'));
  const getCurrentTime = storageTime.time;

  var timeInMilliseconds = getCurrentTime;

    // Função para atualizar a contagem regressiva
    function updateCountDown() {
      var minutesRemaining = Math.floor(timeInMilliseconds / 60000);
      var secondsRemaining = Math.floor((timeInMilliseconds % 60000) / 1000);

      // Formate os minutos e segundos para exibição
      var formattedMinutes = minutesRemaining < 10 ? "0" + minutesRemaining : minutesRemaining;
      var formattedSeconds = secondsRemaining < 10 ? "0" + secondsRemaining : secondsRemaining;

      // Exiba a contagem regressiva na div com id "contador"
      counter.innerHTML = formattedMinutes + ":" + formattedSeconds;

      // Reduza o tempo em milissegundos em 1 segundo (1000 milissegundos)
      timeInMilliseconds -= 1000;

      localStorage.setItem("currentTime", JSON.stringify({ started: true, time: timeInMilliseconds}));

      // Verifique se a contagem regressiva chegou a zero
      if (timeInMilliseconds <= 0) {
        clearInterval(interval);
        localStorage.setItem("currentTime", JSON.stringify({ started: false, time: 0}));
        counter.innerHTML = "Tempo esgotado!";
      }
    }

    // Chame a função de atualização a cada segundo (1000 milissegundos)
    var interval = setInterval(updateCountDown, 1000);

    // Inicialize a contagem regressiva
    updateCountDown();
}
