// Fornecer o texto da fase para renderizar na tela

// Lógica da passagem do tempo
document.addEventListener('DOMContentLoaded', () => {
  const avancar = document.getElementById('botaoAvancar');


});

// (function() {
//   var hours = 1;
//   var minutes = 20;
//   var seconds = 0;
//   var ele = document.getElementById('total-timer');
//   var timer = setInterval(() => {
//     var hoursStr = hours.toString().padStart(2, '0');
//     var minutesStr = minutes.toString().padStart(2, '0');
//     var secondsStr = seconds.toString().padStart(2, '0');

//     ele.innerHTML = hoursStr + ':' + minutesStr + ':' + secondsStr;

//     if (hours === 0 && minutes === 0 && seconds === 0) {
//       clearInterval(timer);
//       // Função aqui
//     } else if (seconds === 0) {
//       if (minutes === 0) {
//         hours--;
//         minutes = 59;
//       } else {
//         minutes--;
//       }
//       seconds = 59;
//     } else {
//       seconds--;
//     }
//   }, 1000);
// })();

// let questaoTimerInterval;

// function iniciarTempoQuestao() {
//   questaoTimer = 20;
//   const ele = document.getElementById('questão-timer');
//   ele.innerHTML = questaoTimer >= 10 ? questaoTimer : '0' + questaoTimer;

//   clearInterval(questaoTimerInterval); // Limpe qualquer intervalo anterior
//   questaoTimerInterval = setInterval(() => {
//     ele.innerHTML = questaoTimer >= 10 ? questaoTimer : '0' + questaoTimer;
//     questaoTimer--;

//     if (questaoTimer < 0) {
//       clearInterval(questaoTimerInterval);
//       // Faça algo quando o tempo acabar, se necessário
//     }
//   }, 1000);
// }