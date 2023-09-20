const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origins: "*:*",
    methods: "*",
  }}
);

const fs = require('fs');

// ...


app.use(express.json());
// não remova ou mova esse endpoint
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Altere o '*' caso necessite restringir o domínio
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

const database = 'src/database/users.json';
const quiz = 'src/database/quiz.json';

// 1) USERS
// 1.a) Login
app.post('/users', (req, res) => {
  // Recupera o  usuário
  const user = req.body.user;

  // Confere a lista de usuários (talvez separa em outro arquivo)
  const data = fs.readFileSync(database, 'utf8', async (err, data) => {
    if (err) {
      // erro de leitura
      console.error('Erro ao ler o arquivo:', err)
      return res.status(404).json({ message: `Erro ao ler o arquivo: ${err}`});
    }

    return data;
  });

  if (typeof data === 'string' && data.length === 0) {
    const firstUser = [
      {
        id: 1,
        name: user,
        points: 0
      }
    ]
    
    const initJSON = JSON.stringify(firstUser, null, 2);
    
    fs.writeFileSync(database, initJSON, 'utf8', (err) => {
      if (err) {
        console.error('Erro ao escrever no arquivo:', err);
        return res.status(404).message(`Erro ao cadastrar no arquivo: ${err}`);
      }
    });

    return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  }
  // Converte o conteúdo do arquivo em um objeto JavaScript
  const jsonData = JSON.parse(data);
  
  const qntUsers = jsonData.length;
  
  // Criando um novo objeto para adicionar ao JSON
  const novoObjeto = {
    "id": qntUsers + 1,
    "name": user,
    "points": 0
  };

  // Adicionando o novo objeto à lista existente
  jsonData.push(novoObjeto);

  // Convertendo o JSON atualizado de volta para uma string JSON
  const updatedJSON = JSON.stringify(jsonData, null, 2);

  // Escreve o conteúdo atualizado de volta no arquivo 'users.json'
  fs.writeFileSync(database, updatedJSON, 'utf8', (err) => {
    if (err) {
      console.error('Erro ao escrever no arquivo:', err);
      return res.status(404).message(`Erro ao cadastrar no arquivo: ${err}`);
    }
    console.log('Arquivo "users.json" atualizado com sucesso!');
  });
  
  return res.status(201).json({ message: "Usuário adicionado com sucesso" });
});

// 1.b) Classificação
app.get('/users', (_req, res) => {
  // Confere a lista de usuários (talvez separa em outro arquivo)
  const data = fs.readFileSync(database, 'utf8', (err, data) => {
    if (err) {
      // erro de leitura
      console.error('Erro ao ler o arquivo:', err);
      return res.status(404).json({ message: `Erro ao ler o arquivo: ${err}`});  
    }

    return data;
  });

  const jsonData = JSON.parse(data);

  // Order pelos pontos
  const classification = jsonData.sort((a, b) => b.points - a.points);

  return res.status(200).json(classification);
});


// 1.c) Points
app.patch('/users/:id', (req, res) => {
  const userId = Number(req.params.id);
  const newPoints = req.body.points;

  // Confere a lista de usuários (talvez separa em outro arquivo)
  const users = fs.readFileSync(database, 'utf8', (err, data) => {
    if (err) {
      // erro de leitura
      console.error('Erro ao ler o arquivo:', err);
      return res.status(404).json({ message: `Erro ao ler o arquivo: ${err}`});  
    }

    return data;
  });

  const jsonData = JSON.parse(users);

  console.log('antes do update', jsonData);

  const jsonDataUpdated = jsonData.map((user) => {
    if (user.id === userId) {
      console.log(user);
      user.points = newPoints;
    };

    return user;
  });

  console.log('depois do update', jsonDataUpdated);

  const updatedJSON = JSON.stringify(jsonDataUpdated, null, 2);

  // Escreve o conteúdo atualizado de volta no arquivo 'users.json'
  fs.writeFileSync(database, updatedJSON, 'utf8', (err) => {
    if (err) {
      console.error('Erro ao escrever no arquivo:', err);
      return res.status(404).message(`Erro ao cadastrar no arquivo: ${err}`);
    }
    console.log('Arquivo "users.json" atualizado com sucesso!');
  });

  return res.status(201).json({ message: `Os pontos do usuário ${userId} foram atualizados com sucesso!` });
});

// 2) QUIZ
app.get('/quiz', (_req, res) => {
  // Confere a lista de usuários (talvez separa em outro arquivo)
  const data = fs.readFileSync(quiz, 'utf8', (err, data) => {
    if (err) {
      // erro de leitura
      console.error('Erro ao ler o arquivo:', err);
      return res.status(404).json({ message: `Erro ao ler o arquivo: ${err}`});  
    }

    return data;
  });

  const jsonData = JSON.parse(data);

  return res.status(200).json(jsonData);
});


// ...

// É importante exportar a constante `app`,
// para que possa ser utilizada pelo arquivo `src/server.js`


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('createRoom', (room) => {
    console.log('room', room);
    socket.join(room);
  });

  socket.on('joinRoom', (schoolName, room) => {
    console.log('schoolName', schoolName);
    console.log('room', room);
    socket.join(room);
    socket.to(room).emit('userConnected', schoolName);
  });

  socket.on('startGame', (room) => {
    console.log('room', room);
    socket.broadcast.to(room).emit('gameStarted');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

module.exports = server;