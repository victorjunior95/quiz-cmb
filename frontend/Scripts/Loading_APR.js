const BASE_URL = 'http://localhost:3001';
const socket = io(BASE_URL);
const ROOMID = localStorage.getItem("roomId");
const level = localStorage.getItem("actualLevel");

const levels = {
  facil: 1,
  media: 2,
  dificil: 3
}

socket.on('allUsersConnected', () => {
  window.location.href = "/pages/Quiz_APR.html";
  
  // setTimeout(() => {
  //   window.location.href = "/pages/Quiz_APR.html";
  // }, 60000);
});

const main = () => {
  // // Versão 2.0
  // let paginaAnterior = window.history.go(-1);
  // const pagesGetLoading = ['Answer_APR.html', 'Classification_APR.html'];
  // if (level !== 'facil' && paginaAnterior === pagesGetLoading[1]) {
  //   socket.emit('changeDifficulty', ROOMID, levels[level]);
  //   socket.emit('setTime', ROOMID);
  //   socket.emit('startGame', ROOMID);
  //   socket.on('startedGame', () => {
  //     window.location.href = "/pages/Quiz_APR.html";
  //   });
  // }

  // socket.emit('connectAPR', ROOMID);
  // socket.emit('startGame', ROOMID);
  

  // Versão 1.0 - Ainda na fácil, o tempo da fase está reiniciando a cada pergunta
  if (level === 'facil') {
    socket.emit('connectAPR', ROOMID);
    socket.emit('startGame', ROOMID);
  }

  console.log('level - Loading', `${typeof level} e ${level}`); // obj e null?
  console.log('levels - Loading', `${typeof levels[level]} e ${levels[level]}`);
  
  socket.emit('changeDifficulty', ROOMID, levels[level]); // está enviando um objeto null
  // Aqui a fase já precisa estar mudada para setar um novo tempo
  // Ainda não está mandando as perguntas da nova fase para o usuário
  socket.emit('setTime', ROOMID);
  // Sem o código abaixo ele está indo para a pergunta da nova fase, porém não recomeça a contagem do tempo da nova fase

  // Falta redirecionar para a tela de Quiz_APR.html (?) parece que sim
  // Seria com emit('startGame'), on('startedGame') ou outro?
  // 1. emit('startGame')
  socket.emit('startGame', ROOMID);

  // 2. on('startedGame') - Parece que é esse!
  socket.on('startedGame', () => {
    window.location.href = "/pages/Quiz_APR.html";
  });

  // 3. outro
  // socket.emit('continueGame', ROOMID); // outro
  // socket.on('gameContinued', () => {
  //   window.location.href = "/pages/Quiz_USR.html";
  // });

};
main();
