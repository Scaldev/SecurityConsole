function clearGame() {
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.clearRect(0, 0, 1500, 800);
  Player.alive = false;
  for (let intName in Intervals) clearInterval(Intervals[intName]);
}

function buttonDisplay(result) {

  setTimeout(() => { // display the buttons.

    // Button 1:
    button1.innerHTML = "Menu";
    button1.style.display = "block";
    button1.style.opacity = 0;

    // Button 2:
    button2.innerHTML = result === 'win' ? "Continue" : "Retry";
    button2.style.display = "block";
    button2.style.opacity = 0;

    let opacityValue = 0;

    // Displaying the buttons with a fog effect:
    let buttonFogInterval = setInterval(() => {
      opacityValue += 0.01;
      button1.style.opacity = opacityValue.toString();
      button2.style.opacity = opacityValue.toString();
      if (opacityValue >= 1) clearInterval(buttonFogInterval);
    }, 10);

  }, 1000)

}

// KILLED ####################################################################
function gameOverKilled() {

  clearGame()

  let emojiSize = 50;
  let bot = whoIsOn(Player.square);
  textInputState('end', `An animatronic killed you.`, 10);

  let jumpscareInterval = setInterval(() => {

    emojiSize *= 1.25
    ctx.clearRect(0, 0, 1500, 800);
    ctx.font = `${Math.round(emojiSize)}px Courier`;
    ctx.fillText(bot, 750, 500);

    if (emojiSize > 500) clearInterval(jumpscareInterval);

  }, 10)

  buttonDisplay('over');

}

// FIRED ####################################################################
function gameOverFired() {

  clearGame()

  ctx.font = `100px Courier`;
  ctx.fillText("You're fired.", 750, 100);
  ctx.font = `64px Courier`;
  ctx.fillText("You have to do your tasks before 6 AM.", 750, 200);

  ctx.font = `16px Courier`;
  ctx.fillText("(and don't die while doing so)", 750, 250);
  textInputState('end', '', 10);

  buttonDisplay('over');

}

// WIN ######################################################################
function gameWin() {

  clearGame();

  ctx.font = `100px Courier`;
  ctx.fillText("Your job is done.", 750, 150);
  ctx.fillText("See you tomorrow.", 750, 250);

  ctx.font = `16px Courier`;
  ctx.fillText("(Have a good night)", 750, 300);
  textInputState('end', '', 10);

  buttonDisplay('win');


  if (parseInt(localStorage.getItem('Night')) !== 6) {
    localStorage.setItem('Night', parseInt(localStorage.getItem('Night')) + 1); // save the night counts
  }

}