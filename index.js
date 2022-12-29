const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

console.log(localStorage);

const elementsId = ['newGameOrMenuButton', 'continueButton'];

ctx.font = "150px Courier";
ctx.fillStyle = "white";
ctx.textAlign = 'center';
ctx.fillText(`Security Console`, 750, 200);

function startNight() {

  newGameOrMenuButton.style.display = "none";
  continueButton.style.display = "none";

  ctx.font = "200px Courier";
  ctx.fillStyle = "white";
  ctx.textAlign = 'center';
  ctx.clearRect(0, 0, 1500, 800);
  ctx.fillText(`Night ${localStorage.getItem('Night')}`, 750, 300);

  setTimeout(() => {
    start();
  }, 4000);

}

let newGameOrMenuButton = document.getElementById('newGameOrMenuButton');
newGameOrMenuButton.addEventListener('click', function handleClick() {
  localStorage.setItem("Night", 1);
  startNight();
});

let continueButton = document.getElementById('continueButton');
continueButton.addEventListener('click', function handleClick() {
  startNight();
});

let commandInput = document.getElementById("textInput");
commandInput.style.display = "none";
commandInput.addEventListener('keydown', (e) => {
  if (e.key == 'Enter') {
    command(commandInput.value);
    commandInput.value = "";
  }
});