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
  const users = userRead();
  // const newUsers = { ...users, [roomId]: data };
  // Pode melhorar
  let strReferenceData = `users[${roomId}].${key}`;
  strReferenceData = data;
  fs.writeFileSync('src/database/rooms.json', JSON.stringify(users));
}

module.exports = {
  userRead,
  userWriteNewData,
  userRewrite
}
