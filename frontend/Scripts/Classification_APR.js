const BASE_URL = 'https://quiz-cmb-production-e86e.up.railway.app';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");

const showClassification = (usersList) => {
  const schoolList = document.getElementById('schoolList');
  usersList.sort((a, b) => b?.points - a?.points).forEach((user) => {
    const classificationDiv = document.createElement('div');
    classificationDiv.className = 'classificationDiv';
    const classificationSpan = document.createElement('span');
    classificationSpan.className = 'classificationSpan';
    classificationSpan.textContent = user.schoolName;
    classificationSpan.id = user.schoolName;
    const classificationPoints = document.createElement('span');
    classificationPoints.className = 'classificationPoints';
    classificationPoints.textContent = user.points + " Pontos";
    classificationPoints.id = user.points;
    classificationDiv.appendChild(classificationSpan);
    classificationDiv.appendChild(classificationPoints);
    schoolList.appendChild(classificationDiv);
  });
}

socket.on('showClassificationAPR', (usersList) => {
  document.getElementById("loading").remove();
  showClassification(usersList);
  socket.emit('sendClassification', ROOMID, usersList);
});

socket.on('receiveTotalTimer', ({ endTime }) => {
  totalTimer(endTime);
});

let nextButtonLink = "/pages/Loading_APR.html";
const main = () => {
  socket.emit('connectAPRClassification', ROOMID);

  const completedAnswers = JSON.parse(
    localStorage.getItem("perguntasCompletas")
  );
  const isLastDifficultyCompleted = !completedAnswers['dificil']?.length
  
  const nextButton = document.getElementById("botaoAvancar");

  if(isLastDifficultyCompleted) {
    nextButton.remove()
  }

  nextButton.addEventListener('click', () => {
    window.location.href = nextButtonLink;
  });
};

main();

let totalTimerInterval;
function totalTimer(endTime) {
  const actualTime = new Date().getTime();
  const timeLeft = Math.round((endTime - actualTime) / 1000);
  var hours = 0;
  var minutes = Math.floor(timeLeft / 60);
  var seconds = timeLeft % 60;

  var totalTimerInterval = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        hours--;
        minutes = 59;
      } else {
        minutes--;
      }
      seconds = 59;
    } else {
      seconds--;
    }

    hours < 0 ? hours = 0 : hours;
    minutes < 0 ? minutes = 0 : minutes;
    seconds < 0 ? seconds = 0 : seconds;

    if (hours === 0 && minutes === 0 && seconds === 0) {
      clearInterval(totalTimerInterval);
      nextButtonLink = "/pages/Quiz_APR.html";
    }
  }, 1000);
};
