function textInputState(state, text, duration, optinal) {

  let settings = {
    usable: { colorCode: '006900', colorArrow: 'green' },
    error: { colorCode: '690000', colorArrow: 'red' },
    warn: { colorCode: '696900', colorArrow: 'yellow' },
    task: { colorCode: '696969', colorArrow: 'gray' },
    fix: { colorCode: '696969', colorArrow: 'gray' },
    end: { colorCode: '000000', colorArrow: '' }
  }

  commandInput.disabled = state === 'end';
  commandInput.style.border = `2px solid #${settings[state].colorCode}`;
  commandInput.style.backgroundImage = `url('imgs/prompt/prompt_${settings[state].colorArrow}.png')`;

  if (!optinal || (!Systems[optinal] && commandInput.placeholder === optinal)) {
    commandInput.placeholder = text;
  }
  if (state === 'end') commandInput.value = '';

  if (duration) {
    setTimeout(() => {

      if (Player.alive) {

        if (state === 'usable' || state === 'warn') {
          textInputState('usable', "enter a command here.");

        } else if (state == 'fix' && Player.tasking) {
          Player.tasking = false;
          Systems[optinal].working = true; // optional = fixed system
          textInputState('usable', "and voilà! The system is fixed.", 2);
        }

        if (state == 'task' && Player.tasking) {
          Player.tasking = false;
          if (Player.tasks[0].steps.length === 1) {
            Player.tasks.shift();
          } else {
            Player.tasks[0].steps.shift();
          }
          console.log("TASK DONE!", Player.tasks)
          textInputState('usable', "and voilà! The task is done.", 2);
          Systems['noise'].usage += 1;
        }

      }

    }, duration * 1000);
  }

}

function command(input) {

  input = input.split(' ');

  if (Player.tasking) {
    Player.tasking = false;
    Systems['noise'].usage += 100;
    textInputState('warn', 'WARNING: leaving during an action might cause a dysfunction.', 2);
  }

  switch (input[0]) {

    case 'cam':
      if (Battery <= 0) {
        textInputState('error', 'no battery.', 1);
      } else if (!Systems['cam'].working) {
        textInputState('error', 'the camera system is not working.', 1);
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
        textInputState('error', 'no battery.', 1);
      } else {
        Player.hiding = true;
      }
      break;

    case 'task':

      if (Player.square !== Player.tasks[0].steps[0].square) {
        textInputState('error', 'the task to do is not here.', 1);
      } else {

        if (Cam !== "") Cam = "";
        if (Player.hiding) Player.hiding = false;
        Player.tasking = true;

        textInputState('task', `doing the task: please wait ${Player.tasks[0].steps[0].time} seconds.`, Player.tasks[0].steps[0].time);

      }

      break;

    case 'noise':
      if (Battery <= 0) {
        textInputState('error', 'no battery.', 1);
      } else if (!Systems['noise'].working) {
        textInputState('error', 'the noise system is not working.', 1);
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
        case 'l': squareDestination = squareDestination[0] + `${parseInt(squareDestination[1]) - 1}`; break;
        case 'r': squareDestination = squareDestination[0] + `${parseInt(squareDestination[1]) + 1}`; break;
        case 'u': squareDestination = `${parseInt(squareDestination[0]) - 1}` + squareDestination[1]; break;
        case 'd': squareDestination = `${parseInt(squareDestination[0]) + 1}` + squareDestination[1]; break;
      }

      if (getRoomName(squareDestination) === "VE" && !Systems["vent"].working) { // vent check
        textInputState('error', 'the ventilation system is not working.', 1);
      } else if (Squares[Player.square].neighbors.includes(squareDestination)) {
        Player.square = squareDestination;
      }

      break;

    case 'fix':

    let systemHere = "";
    for (let sys in Systems) {
      if (Systems[sys].square === Player.square) {
        systemHere = sys;
      }
    }

      if (systemHere === "") {
        textInputState('error', "no system to fix here.", 1500);
      } else {

        if (Cam !== "") Cam = "";
        if (Player.hiding) Player.hiding = false;
        Player.tasking = true;

        textInputState('fix', 'fixing system: please wait...', Systems[systemHere].time, systemHere);
      };

      break;

  };

  screenFrame();

}