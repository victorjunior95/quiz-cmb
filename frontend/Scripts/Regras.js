const socket = io('http://localhost:3001');

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
