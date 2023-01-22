// Uitlity functions #########################################################################################################################################

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

  if (Player.tasks.length === 0 || !Player.alive) return;

  // MAP (MIDDLE) #################################################################################################################################################

  ctx.textAlign = 'center';
  ctx.fillStyle = `rgba(255, 255, 255, ${Player.hiding ? '0.5' : '1'})`;

  ctx.drawImage(images['map'], 500, 30);

  let roomsChecked = [];

  player_x = getX(Player.square)
  player_y = 40 + parseInt(Player.square[0]) * 64 + 32;

  // SHADOWS & LIGHTS :
  ctx.fillStyle = `rgba(0, 0, 0, ${Cam !== "" ? '0.95' : '0.97'})`;
  ctx.beginPath();
  ctx.arc(getX(Player.square), getY(Player.square) - 10, 80 - LightState, 0, 2 * Math.PI, true);
  ctx.rect(500, 30, 1200 - 500, 600 - 30);
  ctx.fill();

  if (Player.tasking || Battery <= 0 || !Systems['light'].working) {
    LightState += 0.075;
    if (LightState > 70) LightState = 70;
  } else if (!Player.tasking && LightState > 0 && Battery > 0 && Systems['light'].working) {
    LightState -= 2;
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
  ctx.arc(getX(Player.tasks[0].steps[0].square), getY(Player.tasks[0].steps[0].square) - 8, 1 + DotState, 0, 2 * Math.PI, true);
  ctx.fill();
  DotState += 0.125;
  if (DotState > 10) DotState = 0;

  // NOISE ######################################
  ctx.fillStyle = `rgba(0, 0, 255, ${1 - NoiseState / 80})`;
  ctx.beginPath();
  ctx.arc(getX(Noise), getY(Noise) - 8, 1 + NoiseState, 0, 2 * Math.PI, true);
  ctx.fill();
  if (Noise !== "") {
    NoiseState += 0.5;
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
    SabotageState += (0.125 / sabotagedSystems.length);
    if (SabotageState > 10) SabotageState = 0;
  }


  // TEXT (LEFT SIDE) ##############################################################################################################################################

  ctx.textAlign = 'left';
  ctx.fillStyle = "white";
  ctx.font = "24px Courier";

  // TITLE
  fillTextMultiLine(ctx, "     INFORMATIONS", 16, 16);

  ctx.font = "18px Courier";
  let text = "";

  // TIME & BATTERY
  let hours = ["12", "1", "2", "3", "4", "5", "6"];
  let hour = hours[Math.floor(Sec / 30)];
  let coloredSquares = ['🟩', '🟨', '🟧', '🟥'];
  let displayedColors = coloredSquares.slice(0, addPowerUsage());
  while (displayedColors.length < 4) displayedColors.push('⬛️');
  text += `------- GENERAL ------\n\n`;
  text += `• Hour: ${hour} AM\n\n`;
  text += `• Power: ${Math.ceil(Battery)}%\n\n`;
  text += `• Usage: ${displayedColors.join('')}\n\n\n\n`;

  // TASKS
  text += `-------- TASKS -------\n\n`;
  text += `• Done: ${Player.numberOfTasks - Player.tasks.length}/${Player.numberOfTasks}\n\n`;
  text += `• Next task to do:\n\n`;
  text += ` - Goal: ${Player.tasks[0].steps[0].content}\n\n`;
  text += ` - Room: ${Rooms[getRoomName(Player.tasks[0].steps[0].square)].name}\n\n`;
  text += ` - Step: ${Player.tasks[0].numberOfSteps - Player.tasks[0].steps.length}/${Player.tasks[0].numberOfSteps}`;
  fillTextMultiLine(ctx, text, 16, 80);


  if (sabotagedSystems.length > 0) {
    text = `-------- SYSTEMS -------\n\n`;
    text += "Some systems need a manuel restart:\n\n";
    for (let sys in Systems) {
      if (Systems[sys].working === false) {
        text += `• ${Systems[sys].name} (in ${Rooms[getRoomName(Systems[sys].square)].name}).\n\n`;
      }
    }
    ctx.fillStyle = "red";
    fillTextMultiLine(ctx, text, 16, 385);

  }

  // TEXT (RIGHT SIDE) #############################################################################################################################################

  // TITLE
  ctx.font = "24px Courier";
  ctx.fillStyle = "white";
  fillTextMultiLine(ctx, "      COMMANDS", 1200, 16);

  ctx.font = "18px Courier";
  text = "";

  text += `---------- YOU --------\n\n`;
  text += `• >> mv left/right/up/down\n\n`;
  text += `• >> hide\n\n`;
  text += `• >> task\n\n`;
  text += `• >> fix\n\n\n`;

  text += `--------- TOOLS --------\n\n`;
  text += `• >> cam (off/<initials>)\n\n`;
  text += `• >> noise on/off\n\n`;

  fillTextMultiLine(ctx, text, 1200, 80);

  // TEXT (BOTTOM SIDE) ##########################################################################################################################################

  let callSubtitles = Calls[parseInt(localStorage.getItem('Night')) - 1];

  if (callSubtitles.length != 0) {

    ctx.textAlign = 'center';
    fillTextMultiLine(ctx, callSubtitles[0], 725, 510);

    subtitleTime += 1;
    console.log(callSubtitles[0].length)
    if (subtitleTime >= 300 + callSubtitles[0].length) { // 5 seconds.
      subtitleTime = 0;
      callSubtitles.shift();
    }

  }


  // STARTING #####################################################################################################################################################

  if (StartingFog > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${StartingFog})`;
    ctx.rect(0, 0, 1500, 800);
    ctx.fill();
    StartingFog -= 0.01;
  }

}

// SCREEN :

function screenFrame() {
  loadImages(['map'], ['imgs/map/map.png'], drawCanvas);

}