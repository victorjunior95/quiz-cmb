const userUtils = require("../utils/users");

const requestClassification = (socket) => {
  return (roomId) => {
    // Quando um cliente se conecta, envie a classificação atual
    const data = userUtils.userRead();
    const jsonData = data[roomId].users;
    const classification = jsonData.sort((a, b) => b.points - a.points);
  
    socket.emit("classification", classification);
  };
};

module.exports = {
  requestClassification
}