const fs = require('fs');
const database = 'src/database/users.json';

const requestClassification = (socket) => {
  return () => {
    // Quando um cliente se conecta, envie a classificação atual
    const data = fs.readFileSync(database, 'utf8');
  
    const jsonData = JSON.parse(data);
    const classification = jsonData.sort((a, b) => b.points - a.points);
  
    socket.emit("classification", classification);
  };
};

module.exports = {
  requestClassification
}