const fs = require('fs');

const userRead = () => JSON.parse(fs.readFileSync('src/database/rooms.json', 'utf8'));

const userWrite = (room, data) => {
  const users = userRead();
  const newUsers = { ...users, [room]: data };
  fs.writeFileSync('src/database/rooms.json', JSON.stringify(newUsers));
}

module.exports = {
  userRead,
  userWrite
}