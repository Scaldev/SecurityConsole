const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// TITLE #####################################################################

ctx.font = "150px Courier";
ctx.fillStyle = "white";
ctx.textAlign = 'center';
ctx.fillText(`Security Console`, 750, 150);

// START THE GAME ############################################################

function startNight() {

  button1.style.display = "none";
  button2.style.display = "none";

  ctx.font = "200px Courier";
  ctx.fillStyle = "white";
  ctx.textAlign = 'center';
  ctx.clearRect(0, 0, 1500, 800);
  ctx.fillText(`Night ${localStorage.getItem('Night')}`, 750, 300);

  function reloadFile(file_name) {
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.src = `${file_name}.js`
    head.appendChild(script);
 }

 reloadFile('data/player');
 reloadFile('data/bots');
 reloadFile('data/calls');

  setTimeout(() => {
    gameStart();
  }, 3000);

}

// GET INPUTS #############################################################

let button1 = document.getElementById('button1');
button1.addEventListener('click', function handleClick() {
  
  if (button1.innerHTML === 'Menu') {
    location.reload();
  
  } else if (button1.innerHTML === 'New Game') {
    localStorage.setItem("Night", 1);
    startNight();
  }

});

let button2 = document.getElementById('button2');
button2.addEventListener('click', function handleClick() {
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