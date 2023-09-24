const socket = io('http://localhost:3001');
localStorage.clear();

const createRoom = (roomId) => {
  socket.emit('createRoom', roomId);
}

const waitForStart = (roomId) => {
  const startButton = document.getElementById('sendButton');
  startButton.addEventListener('click', () => {
    const getUsersLength = Number(localStorage.getItem('usersLength'));

    if (getUsersLength > 0) {
      window.location.href = "/pages/LoadingInitial_APR.html";
    } else {
      alert('Nenhum jogador na sala!');
    }
  });
}

socket.on('sendLevel', (level) => {
  localStorage.setItem('actualLevel', level);
});


const main = () => {
  const roomId = Math.random().toString(36).substring(7)
  createRoom(roomId);
  localStorage.setItem("roomId", roomId);
  localStorage.setItem("usersLength", 0);
  const room = document.getElementById('roomIdSpan');
  room.textContent = roomId;
  waitForStart(roomId);
}

const getAllUsers = (users) => {
  localStorage.setItem("usersLength", users.length)
}

const createPanelTeams = (currentUser) => {
  const teamPanel = document.createElement('div');
  teamPanel.className = 'team-panel';
  teamPanel.id = currentUser;
  const teamNameSpan = document.createElement('span');
  teamNameSpan.className = 'teamName';
  teamNameSpan.textContent = '- ' + currentUser;
  teamPanel.appendChild(teamNameSpan);
  const painelTeams = document.getElementById('painel-teams');
  painelTeams.style.display = 'block';
  painelTeams.appendChild(teamPanel);
}

socket.on('currentUser', (currentUser) => {
  createPanelTeams(currentUser);
})

socket.on('usersConnected', (allUsers) => {
  getAllUsers(allUsers);
});

window.onload = main;
