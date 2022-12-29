// Uitlity functions #########################################################################################################################################

function fillTextMultiLine(ctx, text, x, y) {
  let lineHeight = ctx.measureText("M").width * 1.2;
  let lines = text.split("\n");
  for (let i = 0; i < lines.length; ++i) {
    ctx.fillText(lines[i], x, y);
    y += lineHeight;
  }
}

function getX(square) {
  return 500 + parseInt(square[1]) * 64 + 32;
}

function getY(square) {
  return 40 + parseInt(square[0]) * 64 + 32;
}

// #################################################################################################################################################################

function drawCanvas(images) {

  // Clear :

  ctx.clearRect(0, 0, 1500, 800);

  // RIP TEXT  #####################################################################################################################################################

  ctx.textAlign = 'center';
  ctx.fillStyle = `rgba(255, 255, 255, ${Player.hiding ? '0.5' : '1'})`;

  let botOnPlayer = whoIsOn(Player.square);
  if (botOnPlayer !== '•' && !Player.hiding) {

    Player.alive = false;
    for (let intName in Intervals) clearInterval(Intervals[intName]);
    ctx.font = `400px Courier`;
    ctx.fillText(botOnPlayer, 750, 400);
    returnError(`${botOnPlayer} killed you.`, 0);

  } else if (Player.tasks.length === 0) {

    Player.alive = false;
    for (let intName in Intervals) clearInterval(Intervals[intName]);

    ctx.font = `100px Courier`;
    ctx.fillText("Your job is done.", 750, 150);
    ctx.fillText("See you tomorrow.", 750, 250);
    ctx.font = `16px Courier`;
    ctx.fillText("(Have a good night)", 750, 300);
    returnError(`Your job is done.`, 0);
    newGameOrMenuButton.value = "Back to Menu";
    newGameOrMenuButton.style.display = "block";
    continueButton.style.display = "block";

    localStorage.setItem('Night', parseInt(localStorage.getItem('Night')) + 1);

  } else {

    // MAP (MIDDLE) #################################################################################################################################################

    ctx.drawImage(images['map_base'], 500, 30);

    let roomsChecked = [];

    player_x = getX(Player.square)
    player_y = 40 + parseInt(Player.square[0]) * 64 + 32;

    // SHADOWS :
    ctx.fillStyle = `rgba(0, 0, 0, ${Cam !== "" ? '0.95' : '0.97'})`;
    ctx.beginPath();
    ctx.arc(getX(Player.square), getY(Player.square) - 10, 80 - LightState, 0, 2 * Math.PI, true);
    ctx.rect(500, 30, 1200 - 500, 600 - 30);
    ctx.fill();

    if (Player.tasking || Battery <= 0 || !Systems['light'].working) {
      LightState += 0.15;
      if (LightState > 70) LightState = 70;
    } else if (!Player.tasking && LightState > 0 && Battery > 0 && Systems['light'].working) {
      LightState -= 3;
      if (LightState < 0) LightState = 0;
    }

    // SQUARES #################################
    ctx.font = "24px Courier";
    ctx.textAlign = 'center';

    // PLAYER :
    ctx.fillStyle = `rgba(255, 255, 255, ${Player.hiding ? '0.5' : '1'})`;
    ctx.fillText('🤖', getX(Player.square), getY(Player.square));
    ctx.fillStyle = `rgba(255, 255, 255, 1)`;
    if (Cam == "") {
      roomsChecked.push(getRoomName(Player.square));
    }
    if (whoIsOn(Player.square) !== '•') ctx.fillText(whoIsOn(Player.square), getX(Player.square), getY(Player.square));

    // NEIGHBORS :
    if (!Player.tasking && Cam == "" && Battery > 0 && Systems['light'].working) {
      for (let n in Squares[Player.square].neighbors) {
        let neighbor = Squares[Player.square].neighbors[n];
        if (getRoomName(neighbor) !== "VE" || (getRoomName(neighbor) === "VE" && Systems["vent"].working && whoIsOn(neighbor) === '•')) {
          ctx.fillText(whoIsOn(neighbor), getX(neighbor), getY(neighbor));
          roomsChecked.push(getRoomName(neighbor));
        }
      }
    }

    // OTHERS :
    for (let square in Squares) {
      //ctx.fillText(`${Squares[square].noise}`, 500 + parseInt(square[1]) * 64 + 32, 40 + parseInt(square[0]) * 64 + 32); // NOISE LEVEL FOR EACH SQUARE
      let room = getRoomName(square);
      if (Cam == room && square !== Player.square) {
        ctx.fillText(whoIsOn(square), getX(square), getY(square));
      } else if (Cam !== room && Cam != "" && !roomsChecked.includes(room)) {
        ctx.fillText(room, 500 + Rooms[room].position[0], 30 + Rooms[room].position[1]);
        roomsChecked.push(room);
      }
    }

    // TASKS ####################################
    ctx.fillStyle = `rgba(255, 255, 0, ${1 - DotState / 10})`;
    ctx.beginPath();
    ctx.arc(getX(Player.tasks[0][0].square), getY(Player.tasks[0][0].square) - 8, 1 + DotState, 0, 2 * Math.PI, true);
    ctx.fill();
    DotState += 0.25;
    if (DotState > 10) DotState = 0;

    // NOISE ######################################
    ctx.fillStyle = `rgba(0, 0, 255, ${1 - NoiseState / 80})`;
    ctx.beginPath();
    ctx.arc(getX(Noise), getY(Noise) - 8, 1 + NoiseState, 0, 2 * Math.PI, true);
    ctx.fill();
    if (Noise !== "") {
      NoiseState += 1;
      if (NoiseState > 80) NoiseState = 0;
    } else if (Noise === "" && NoiseState !== 0) {
      NoiseState = 0;
    }

    // SABOTAGES ######################################

    let sabotagedSystems = [];
    for (let sys in Systems) {
      if (Systems[sys].working === false) {
        sabotagedSystems.push(sys);
      }
    }

    for (let i in sabotagedSystems) {
      let sys = sabotagedSystems[i];
      ctx.fillStyle = `rgba(255, 0, 0, ${1 - SabotageState / 10})`;
      ctx.beginPath();
      ctx.arc(getX(Systems[sys].square), getY(Systems[sys].square) - 8, 1 + SabotageState, 0, 2 * Math.PI, true);
      ctx.fill();
      SabotageState += (0.25 / sabotagedSystems.length);
      console.log(sabotagedSystems, SabotageState);
      if (SabotageState > 10) SabotageState = 0;
    }


    // TEXT (LEFT SIDE) ##############################################################################################################################################

    ctx.textAlign = 'left';
    ctx.fillStyle = "white";
    ctx.font = "24px Courier";

    // TITLE
    fillTextMultiLine(ctx, "   INFORMATIONS", 16, 16);

    ctx.font = "18px Courier";
    let text = "";

    // TIME
    let hours = ["12", "1", "2", "3", "4", "5", "6"];
    let hour = hours[Math.floor(Sec / 30)];
    text += `--------- TIME --------\n\n`;
    text += `• Hour : ${hour} AM\n\n\n`;

    // BATTERY
    let coloredSquares = ['🟩', '🟨', '🟧', '🟥'];
    let displayedColors = coloredSquares.slice(0, addPowerUsage());
    while (displayedColors.length < 4) displayedColors.push('⬛️');
    text += `------- BATTERY -------\n\n`
    text += `• Power : ${Math.ceil(Battery)}%\n\n`;
    text += `• Usage : ${displayedColors.join('')}\n\n\n\n`;

    // TASKS
    let taskStep = Player.tasks[0][0].step;
    let taskNumberOfSteps = Player.tasks[0][Player.tasks[0].length - 1].step;
    text += `-------- TASKS --------\n\n`;
    text += `• Done : ${Player.numberOfTasks - Player.tasks.length}/${Player.numberOfTasks}\n\n`;
    text += `• Next task to do :\n\n`;
    text += ` - Goal : ${Player.tasks[0][0].content}\n\n`;
    text += ` - Room : ${Rooms[getRoomName(Player.tasks[0][0].square)].name}\n\n`;
    text += ` - Step : ${taskStep - 1}/${taskNumberOfSteps}`;
    fillTextMultiLine(ctx, text, 16, 80);

    // TEXT (RIGHT SIDE) #############################################################################################################################################

    // TITLE
    ctx.font = "24px Courier";
    fillTextMultiLine(ctx, "    COMMANDS", 1200, 16);

    ctx.font = "18px Courier";
    text = "";

    text += `--------- YOU -------\n\n`;
    text += `• MOVE :\n\n >> mv left/right/up/down\n\n`;
    text += `• HIDE :\n\n >> hide\n\n`;
    text += `• TASK :\n\n >> task\n\n`;
    text += `• FIX :\n\n >> fix\n\n\n`;

    text += `--------- HELP --------\n\n`;
    text += `• CAMERAS :\n\n >> cam (off/<initials>)\n\n`;
    text += `• NOISE :\n\n >> noise on/off\n\n\n`;

    fillTextMultiLine(ctx, text, 1200, 80);

    // TEXT (BOTTOM SIDE) ##########################################################################################################################################

    if (sabotagedSystems.length > 0) {
      text = "The following systems need a manuel restart :\n\n";
      for (let sys in Systems) {
        if (Systems[sys].working === false) {
          text += `• the ${sys} system (in ${Rooms[getRoomName(Systems[sys].square)].name}).\n`;
        }
      }

      ctx.textAlign = 'left';
      ctx.fillStyle = "red";
      fillTextMultiLine(ctx, text, 500, 510);
    }

    // STARTING #####################################################################################################################################################

    if (startingFog > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${startingFog})`;
      ctx.rect(0, 0, 1500, 800);
      ctx.fill();
      startingFog -= 0.01;
    }

  }

}

// SCREEN :

function screen() {

  function loadImages(names, files, onAllLoaded) {
    var i = 0, numLoading = files.length;
    const onload = () => --numLoading === 0 && onAllLoaded(images);
    const images = {};
    while (i < files.length) {
      const img = images[names[i]] = new Image;
      img.src = files[i++];
      img.onload = onload;
    }
    return images;
  }

  loadImages(['map_base'], ['imgs/map_base.png'], drawCanvas);

}