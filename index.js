const button = document.getElementById('btn_newgame');
const canvas = document.getElementById("myCanvas");
const textInput = document.getElementById("textInput");

const elementsId = ['btn_newgame', 'btn_continue'];

const ctx = canvas.getContext("2d");
ctx.font = "12px Courier";
ctx.fillStyle = "white";

button.addEventListener('click', function handleClick() {

  for (let i in elementsId) {
    document.getElementById(elementsId[i]).remove();
  }

  start(0);
});

textInput.addEventListener('keydown', (e) => {
  if (e.key == 'Enter') {
    command(textInput.value);
    textInput.value = "";
  }
})

console.log(Freddy);