const fs = require('fs');

const userRead = () => JSON.parse(fs.readFileSync('src/database/rooms.json', 'utf8'));

// const userWriteNewData = (roomId, data) => {
//   const users = userRead();
//   const newUsers = { ...users, [roomId]: data };
//   fs.writeFileSync('src/database/room.json', JSON.stringify(newUsers));
// }
const userWriteNewData = (roomId, data) => {
  const users = userRead();
  const newUsers = { ...users, [roomId]: data };
  fs.writeFileSync('src/database/rooms.json', JSON.stringify(newUsers));
}

const userRewrite = (roomId, key, data) => {
  console.log(`
    roomId: ${typeof roomId} e ${roomId}
    key: ${typeof key} e ${key}
    data: ${typeof data} e ${data}
  `);
  const users = userRead();

  console.log('users[roomId]:', users[roomId]);
  if (users[roomId]) {
    console.log('users[roomId][key]:', users[roomId][key]);
    users[roomId][key] = data;
    // Escreva os dados atualizados no arquivo JSON
    fs.writeFileSync('src/database/rooms.json', JSON.stringify(users));
  } else {
    console.error(`Sala com ID ${roomId} não encontrada.`);
  }
}

module.exports = {
  userRead,
  userWriteNewData,
  userRewrite
}
