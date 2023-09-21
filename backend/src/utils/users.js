const fs = require('fs');

const userRead = () => JSON.parse(fs.readFileSync('src/database/users.json', 'utf8'));

const userWrite = (room, data) => {
  const users = userRead();
  const newUsers = { ...users, [room]: data };
  fs.writeFileSync('src/database/users.json', JSON.stringify(newUsers));
}

module.exports = {
  userRead,
  userWrite
}