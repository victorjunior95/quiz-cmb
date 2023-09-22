const socket = io('http://localhost:3001');

const waitForStart = (roomId) => {
  const startButton = document.getElementById('comecarQuiz');
  startButton.addEventListener('click', () => {
    window.location.href = "/pages/LoadingInitial_APR.html";
  });
}

socket.on('sendLevel', (level) => {
  localStorage.setItem('actualLevel', level);
});