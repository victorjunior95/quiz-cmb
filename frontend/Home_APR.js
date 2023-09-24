const socket = io('http://localhost:3001');
localStorage.clear();

const userConnecteds = [];

const createRoom = (roomId) => {
  socket.emit('createRoom', roomId);
}

const waitForStart = () => {
  const startButton = document.getElementById('sendButton');
  startButton.addEventListener('click', () => {
    if (userConnecteds.length === 0) {
      alert('Nenhuma equipe conectada');
      return;
    }
    window.location.href = "/pages/Regras.html";
  });
}

const main = () => {
  const roomId = Math.random().toString(36).substring(7)
  createRoom(roomId);
  localStorage.setItem("roomId", roomId);
  const room = document.getElementById('roomIdSpan');
  room.textContent = roomId;
  waitForStart();
}

const createTeamPanel = (teamName) => {
  const teamPanel = document.createElement('div');
  teamPanel.className = 'teamPanel';
  teamPanel.id = teamName;
  const teamNameSpan = document.createElement('span');
  teamNameSpan.className = 'teamName';
  teamNameSpan.textContent = teamName;
  teamPanel.appendChild(teamNameSpan);
  const painelTeams = document.getElementById('painel-teams');
  painelTeams.appendChild(teamPanel);
}


socket.on('userConnected', (schoolName) => {
  userConnecteds.push(schoolName);
  createTeamPanel(schoolName);
});

window.onload = main;
