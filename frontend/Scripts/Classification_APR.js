const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");

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
    classificationPoints.textContent = user.points;
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

const main = () => {
  socket.emit('connectAPRClassification', ROOMID);

  const nextButton = document.getElementById("botaoAvancar");
  nextButton.addEventListener('click', () => {
    window.location.href = "/pages/Loading_APR.html";
  });

  // const classificationButton = document.getElementById("botaoClassificacao");
  // classificationButton.addEventListener('click', () => {
  //   window.location.href = "/pages/Classification_APR.html";
  // });
};

main();