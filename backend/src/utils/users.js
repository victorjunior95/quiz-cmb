const fs = require('fs');

const userRead = () => JSON.parse(fs.readFileSync('src/database/rooms.json', 'utf8'));

const userWriteNewData = (roomId, data) => {
  const users = userRead();
  const newUsers = { ...users, [roomId]: data };
  fs.writeFileSync('src/database/rooms.json', JSON.stringify(newUsers));
}

const userRewrite = (roomId, key, data) => {
  const users = userRead();

  if (users[roomId]) {
    users[roomId][key] = data;
    fs.writeFileSync('src/database/rooms.json', JSON.stringify(users));
  } else {
    console.error(`Sala com ID ${roomId} não encontrada.`);
  }
}

module.exports = {
  userRead,
  userWriteNewData,
  userRewrite,
}
