const socket = io('quiz-cmb-production.up.railway.app');

const main = () => {
  startGame()
}

const startGame = () => {
  const startButton = document.getElementById('comecarQuiz');
  startButton.addEventListener('click', () => {
    window.location.href = "/pages/LoadingInitial_APR.html";
  });
}

window.onload = main;
