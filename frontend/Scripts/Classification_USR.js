const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const { roomId } = JSON.parse(localStorage.getItem("roomData"));

const showClassification = (usersList) => {
  const schoolList = document.getElementById('schoolList');
  usersList.forEach((user) => {
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

socket.on('showClassificationUSR', (usersList) => {
  document.getElementById("loading").remove();
  showClassification(usersList);
});

socket.on('gameStarted', () => {
  window.location.href = "/pages/Quiz_USR.html";
});

const main = () => {
  socket.emit('connectClassification', roomId);
};

main();