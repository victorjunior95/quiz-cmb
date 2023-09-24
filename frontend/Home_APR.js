const socket = io('http://localhost:3001');
localStorage.clear();

const userConnecteds = [];

const createRoom = (roomId) => {
  socket.emit('createRoom', roomId);
}

const waitForStart = () => {
  const startButton = document.getElementById('sendButton');
  startButton.addEventListener('click', () => {
    const getUsersLength = Number(localStorage.getItem('usersLength'));

    if (getUsersLength > 0) {
      window.location.href = "/pages/Regras.html";
    } else {
      alert('Nenhum jogador na sala!');
    }
  });
}

const main = () => {
  const roomId = Math.random().toString(36).substring(7)
  createRoom(roomId);
  localStorage.setItem("roomId", roomId);
  localStorage.setItem("usersLength", 0);
  const room = document.getElementById('roomIdSpan');
  room.textContent = roomId;
  waitForStart();
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

socket.on('userConnected', (schoolName) => {
  userConnecteds.push(schoolName);
  createTeamPanel(schoolName);
});

window.onload = main;
