function normalTextInput(textInput, text) {
  textInput.disabled = false;
  textInput.placeholder = text;
  textInput.style.border = '2px solid #006900';
  textInput.style.backgroundImage = "url('imgs/prompt/prompt_green.png')";
  setTimeout(() => {
    textInput.placeholder = `enter a command here`;
  }, 2000);
}

function returnError(text, timeToFix) {
  let textInput = document.getElementById("textInput");
  textInput.placeholder = text;
  textInput.style.border = '2px solid #690000';
  textInput.style.backgroundImage = "url('imgs/prompt/prompt_red.png')";
  textInput.disabled = true;

  if (timeToFix > 0) {
    setTimeout(() => {
      normalTextInput(textInput, "enter a command here");
    }, timeToFix);
  };

}

function command(input) {

  input = input.split(' ');

  switch (input[0]) {

    case 'cam':
      if (Battery <= 0) {
        returnError("No battery.", 1000);
      } else if (!Systems['cam'].working) {
        returnError("The camera system is not working.", 1000);
      } else {
        if ((input.length === 1 && Cam != "") || input[1] === 'off') {
          Cam = "";
        } else {
          whichSquare = input[1]?.toUpperCase();
          Cam = Rooms[whichSquare] ? whichSquare : " ";
        }
      };
      break;

    case 'hide':
      if (Battery <= 0) {
        returnError("No battery.", 1000);
      } else {
        Player.hiding = true;
      }
      break;

    case 'task':

      if (Cam !== "") Cam = "";
      if (Player.hiding) Player.hiding = false;

      let textInputTask = document.getElementById("textInput");
      textInputTask.disabled = true;
      textInputTask.placeholder = `Doing the task : please wait ${Player.tasks[0][0].time} seconds.`;
      textInputTask.style.border = '2px solid #696969';
      textInputTask.style.backgroundImage = "url('imgs/prompt/prompt_gray.png')";

      Player.tasking = true;

      setTimeout(() => {

        if (Player.alive) {
          Player.tasking = false;
          normalTextInput(textInputTask, "And voilà! The task is done.");
          Player.tasks[0].shift();
          if (Player.tasks[0].length === 0) {
            Player.tasks.shift();
          }
        }

      }, Player.tasks[0][0].time * 1000);

      break;

    case 'noise':
      if (Battery <= 0) {
        returnError("No battery.", 1000);
      } else if (!Systems['noise'].working) {
        returnError("The noise system is not working.", 1000);
      } else {
        whichInput = input[1]?.toUpperCase(); // ON, OFF
        if (whichInput === "ON") {
          Noise = Player.square;
        } else if (whichInput === "OFF") {
          Noise = "";
        }
      }

      break;

    case 'mv':

      if (Cam !== "") Cam = "";
      if (Player.hiding) Player.hiding = false;
      direction = input[1]?.toLowerCase();

      let squareDestination = Player.square;
      switch (direction) {
        case 'left': squareDestination = squareDestination[0] + `${parseInt(squareDestination[1]) - 1}`; break;
        case 'right': squareDestination = squareDestination[0] + `${parseInt(squareDestination[1]) + 1}`; break;
        case 'up': squareDestination = `${parseInt(squareDestination[0]) - 1}` + squareDestination[1]; break;
        case 'down': squareDestination = `${parseInt(squareDestination[0]) + 1}` + squareDestination[1]; break;
      }

      if (getRoomName(squareDestination) === "VE" && !Systems["vent"].working) { // vent check
        returnError("The ventilation system is not working.", 1000);
      } else if (Squares[Player.square].neighbors.includes(squareDestination)) {
        Player.square = squareDestination;
      }

      break;

    case 'fix':

      if (Cam !== "") Cam = "";
      if (Player.hiding) Player.hiding = false;

      let systemHere = "";
      for (let sys in Systems) {
        if (Systems[sys].square === Player.square) {
          systemHere = sys;
        }
      }

      if (systemHere === "") {
        returnError("No system to fix here.", 1500);
      } else {

        let textInputFix = document.getElementById("textInput");
        textInputFix.disabled = true;
        textInputFix.placeholder = 'fixing system : please wait...';
        textInputFix.style.border = '2px solid #696969';
        textInputFix.style.backgroundImage = "url('imgs/prompt/prompt_gray.png')";

        setTimeout(() => {
          Systems[systemHere].working = true;
          normalTextInput(textInputFix, 'And voilà! The system is fixed.');

        }, Systems[systemHere].time);

      };

      break;

  };

  screen();

}