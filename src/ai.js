////////////////////////////////////////////// MOVE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function canEnterOffice(square) {
  return (square == "42" && !Doors['l'].closed) || (square == "33" && !Doors['f'].closed) || (square == "44" && !Doors['r'].closed) || (square == "53" && !Doors['b'].closed);
}

function returnToRoom(bot) {
  availableSquares = []
  for (let n in Rooms[bot.restartRoom].squares) {
    if (!whoIsOn(Rooms[bot.restartRoom].squares[n])[0]) availableSquares.push(Rooms[bot.restartRoom].squares[n]) // if no one is on this square, add it to the list of available squares
  }
  if (availableSquares.length == 0) return bot.square // if no square is available, then don't move
  return availableSquares[Math.floor(Math.random() * availableSquares.length)] // otherwise, return a random square between the available ones
}

function move(bot) {

  foxyBypass = bot.name == "Foxy" && bot.state == 6;

  if (randomNumber(0, 20) <= bot.level || foxyBypass) { // if bot moves

    console.log(bot.name, "is moving!")
    console.log(bot.mapPath);

    function allowedNeighbors(bot, square) {
      let neighbors = [];
      for (let n in Connections[square]) {
        if (canGoThere(bot, Connections[square][n])) neighbors.push(Connections[square][n]);
      }
      return neighbors;
    }

    let neighbors = allowedNeighbors(bot, bot.square);
    if (bot.name == "Bonnie") { // for Bonnie, allow him to go to the squares after the neighboring squares (he can jump very far).
      for (let n in neighbors) {
        if (neighbors[n] != "43") {
        neighbors = neighbors.concat(allowedNeighbors(bot, Connections[neighbors[n]]));
        }
      }
    }

    console.log(neighbors);

    casePlusProche = bot.square;
    for (let n in neighbors) { // find the closest square by checking each neighbor how far it is from the office (current square by default)
      if (bot.mapPath[neighbors[n]][1] < bot.mapPath[casePlusProche][1]) casePlusProche = neighbors[n]
    }

    if (bot.name == "Foxy" && bot.state < 6) { // if it's a Foxy move and he's still in his cove, add 1 to his counter instead of moving out of his square
      bot.state += 1;
    } else {
      if (casePlusProche == "43" && !canEnterOffice(bot.square)) { // in front of the door, but door is closed
        if (bot.name == "Foxy") bot.state = 1;
        console.log(bot.name, "n'a pas réusis à rentrer dans l'office")
        bot.square = returnToRoom(bot);
      } else { // not in front of the door, or in front of the door and it is open
        let takeTheBestMove = (randomNumber(0, 20) <= bot.level || foxyBypass || bot.square == '43');
        bot.square = takeTheBestMove ? casePlusProche : neighbors[Math.floor(Math.random() * neighbors.length)];
        console.log(bot.name, "is now on square", bot.square);
      }
    }

  }

  screen();

}