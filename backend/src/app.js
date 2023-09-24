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
const connection = require('./socket/socket.connection');

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

const quiz = 'src/database/quiz.json';

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

io.on('connection', connection);

module.exports = server;