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
  let hour = hours[Math.round(sec / 60)] + ' AM';
  return hour;
}

function getMapLengths() {
  let i = 0;
  let j = 0;
  for (let square in Connections) {
    if (square[0] > i) i = square[0];
    if (square[1] > j) j = square[1];
  }
  return [i, j];
}

function whoIsOn(square) {
  let botsHere = [];
  for (let n in BotsMoving) {
    if (BotsMoving[n].square == square) botsHere.push(BotsMoving[n]);
  }
  return botsHere;
}

function getRoomName(square) {
  for (let room in Rooms) {
    if (Rooms[room].squares.includes(square)) return room;
  }
  return 'XX';
}

function canGoThere(bot, square) {
    return bot.rooms.includes(getRoomName(square));
}

function canGoThroughThatDoor(Bot, square, neighbor) {
  dict = { '33': 'f', '42': 'l', '44': 'r', '53': 'b' };
  return square == '43' ? Bot.doors.includes(dict[neighbor]) : neighbor == '43' ? Bot.doors.includes(dict[square]) : true;
}

function allAllowedSquares(bot) {
    let total = 0;
    for (let square in Connections) {
        if (bot.rooms.includes(getRoomName(square))) total ++;
    }
    return total;
}