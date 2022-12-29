// #########################################################################################

function multStr(str, x) {
  let model = str;
  for (let i = 0; i < x; i++) str += model;
  return str;
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min); // min and max included
}

// #######################################################################################

function getHour(sec) {
  let hours = ['12', '1', '2', '3', '4', '5', '6'];
  let hour = hours[Math.round(sec / 30)] + ' AM';
  return hour;
}

function getMapLengths() {
  let i = 0;
  let j = 0;
  for (let square in Squares) {
    if (parseInt(square[0]) > i) i = parseInt(square[0]);
    if (parseInt(square[1]) > j) j = parseInt(square[1]);
  }
  return [i, j];
}

function addPowerUsage() {
  let usageLevel = 1;
  if (Cam != "") usageLevel += 1;
  if (Noise != "") usageLevel += 1;
  if (Player.hiding) usageLevel += 1;
  return usageLevel;
}
function whoIsOn(square) {
  for (let n in Bots) {
    if (Bots[n].square == square) return Bots[n].emoji;
  }
  return '•';
}

function getRoomName(square) {
  for (let room in Rooms) {
    if (Rooms[room].squares.includes(square)) return room;
  }
  return 'XX';
}

function allAllowedSquares(bot) {
  let total = 0;
  for (let square in Squares) {
    if (bot.rooms.includes(getRoomName(square))) total++;
  }
  return total;
}