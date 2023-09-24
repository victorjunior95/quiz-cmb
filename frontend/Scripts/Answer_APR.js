const BASE_URL = "http://localhost:3001";
const socket = io(BASE_URL);
let currentLevel = localStorage.getItem("actualLevel");
const ROOMID = localStorage.getItem("roomId");

const showAnswer = (question) => {
  const { id, tema, pergunta, alternativas, imgResposta, resposta, descricao } =
    question;

  const divAppend = document.getElementById("page_apr");
  const divPergunta = document.createElement("div");
  const divAlternativas = document.createElement("div");
  const divImagem = document.createElement("div");
  const textTema = document.createElement("h1");
  const textPergunta = document.createElement("text");
  const textDesc = document.createElement("text");

  textTema.textContent = tema;
  textTema.className = "textTema";
  textPergunta.textContent = pergunta;
  textPergunta.className = "textPergunta";
  textPergunta.id = id;
  textDesc.textContent = descricao;
  textDesc.className = "textDesc";

  for (let index = 0; index < alternativas.length; index++) {
    const element = alternativas[index];
    const isCorrect = element.slice(0, 1) === resposta;

    const textAlternativa = document.createElement("li");
    textAlternativa.id = element.slice(0, 1);
    textAlternativa.textContent = element;
    textAlternativa.value = element.slice(0, 1);
    textAlternativa.className = "textAlternativa";
    textAlternativa.style.listStyleType = "none";

    if (isCorrect) {
      textAlternativa.style.backgroundColor = "green";
      textAlternativa.style.color = "white";
    }

    divAlternativas.appendChild(textAlternativa);
  }

  divPergunta.appendChild(textTema);
  divPergunta.appendChild(textPergunta);
  divPergunta.appendChild(textDesc);
  if (imgResposta !== "") {
    const imgElement = document.createElement("img");
    imgElement.src = imgResposta;
    divImagem.appendChild(divAlternativas);
    divImagem.appendChild(imgElement);
    divPergunta.appendChild(imgElement);
  }
  divPergunta.classList.add("divPergunta");
  divAlternativas.classList.add("divAlternativas");
  divAppend.appendChild(divPergunta);
  divAppend.appendChild(divAlternativas);
};

socket.on("showAnswer", (question) => {
  document.getElementById("loading").remove();
  showAnswer(question);
  socket.emit("sendQuestion", question, ROOMID);
});

socket.on("receiveTimer", () => {
  totalTimer();
});

let nextButtonLink = "/pages/Loading_APR.html";

const main = () => {
  socket.emit("connectAPRAnswer", ROOMID);

  const nextButton = document.getElementById("botaoAvancar");

  const completedAnswers = JSON.parse(
    localStorage.getItem("perguntasCompletas")
  );

  const isLastDifficultyCompleted = !completedAnswers['dificil']?.length

  if(isLastDifficultyCompleted) {
    nextButton.remove()
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
    }
  }

  nextButton.addEventListener("click", () => {
    clearInterval(totalTimerInterval);
    updateLevelIfTimeOrQuestionsAreEmpty();
    window.location.href = nextButtonLink;
  });

  const classificationButton = document.getElementById("botaoClassificacao");
  classificationButton.addEventListener("click", () => {
    clearInterval(totalTimerInterval);

    updateLevelIfTimeOrQuestionsAreEmpty();

    window.location.href = "/pages/Classification_APR.html";
  });
};

main();

let totalTimerInterval;

function totalTimer() {
  const counter = document.getElementById("counter");

  const localStorageTime = JSON.parse(localStorage.getItem("currentTime"));
  const currentTime = localStorageTime.time;

  var timeInMilliseconds = currentTime;

  // Função para buscar onde time foi pausado
  function showsPausedTime() {
    var minutesRemaining = Math.floor(timeInMilliseconds / 60000);
    var secondsRemaining = Math.floor((timeInMilliseconds % 60000) / 1000);

    // Formate os minutos e segundos para exibição
    var formattedMinutes =
      minutesRemaining < 10 ? "0" + minutesRemaining : minutesRemaining;
    var formattedSeconds =
      secondsRemaining < 10 ? "0" + secondsRemaining : secondsRemaining;

    // Exibe tempo pausado na tela
    counter.innerHTML = formattedMinutes + ":" + formattedSeconds;
  }

  // Inicializa função
  showsPausedTime();
}
