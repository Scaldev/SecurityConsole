////////////////////////////////////////////// MOVE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function move(bot) {

  let foxyBypass = bot.name == "Foxy" && bot.state >= 6;

  // ROLL A DICE

  if (randomNumber(1, 20) <= bot.level || foxyBypass || bot.square == Player.square) {

    if (bot.name == "Foxy") {

      if (bot.state < 6) {
        bot.state += 1;

      } else if (bot.state === 6 && whoIsOn(Squares[bot.square].routing[Player.square][0]) === '•') { // 6 = chasing player
        bot.square = Squares[bot.square].routing[Player.square][0];
        if (bot.square === Player.square && Player) bot.state += 1;

      } else if (bot.state === 7 && whoIsOn(Squares[bot.square].routing["60"][0]) === '•') { // 7 = going back to his square
        bot.square = Squares[bot.square].routing["60"][0];
        if (bot.square === "60") bot.state = 0;
      }

    } else { // Freddy, Bonnie, Chica, Mangle:

      let squareOptions = [];
      let neighbors = Squares[bot.square].neighbors;
      for (let n in neighbors) {
        let square = neighbors[n];
        if (whoIsOn(square) === '•') {
          for (let i = 0; i < Squares[square].noise * bot.level; i++) {
            squareOptions.push(square);
          }
        }
      }
      if (squareOptions.length > 0) {
        bot.square = squareOptions[Math.floor(Math.random() * squareOptions.length)];
      }
    }

  }

}