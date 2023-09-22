const fs = require('fs');

const userRead = () => JSON.parse(fs.readFileSync('src/database/rooms.json', 'utf8'));

const userWrite = (roomId, data) => {
  const users = userRead();
  const newUsers = { ...users, [roomId]: data };
  fs.writeFileSync('src/database/users.json', JSON.stringify(newUsers));
}

module.exports = {
  userRead,
  userWrite
}
