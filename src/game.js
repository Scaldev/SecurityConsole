function start(night) {

  console.log(`NIGHT ${night}`);

  // STARTING THE BOTS :

  function expand(Bot) {
    for (let square in Bot.mapPath) {
      for (let n in Connections[square]) {
        let neighbor = Connections[square][n];
        if (!Bot.mapPath[neighbor] && canGoThere(Bot, neighbor) && canGoThroughThatDoor(Bot, square, neighbor)) {
          Bot.mapPath[neighbor] = [square, Bot.mapPath[square][1] + 1];
        }
      }
    }
    return Bot.mapPath;
  }

  for (let n in BotsMoving) {
    while (Object.keys(BotsMoving[n].mapPath).length < allAllowedSquares(BotsMoving[n])) {
      BotsMoving[n].mapPath = expand(BotsMoving[n]) // { '43': ['43', 0], '33': ['43', 1], ... }
    }
  }

  for (let n in BotsMoving) {
    Intervals[BotsMoving[n].name] = setInterval(() => { move(BotsMoving[n]); }, BotsMoving[n].interval * 1000);
  };


  // STARTING THE GAME :

  Intervals['eachTenthOfSec'] = setInterval(() => {

    Sec += 0.1;

    // Remove a bit of battery:

    if (Battery.pc > 0) {
      let newLevel = 0;
      if (Cam != '') newLevel += 1;
      for (let d in Doors) {
        if (Doors[d].closed) newLevel += 1;
      }
      Battery.pc -= 0.02 * newLevel;
      Battery.lvl = newLevel;

    } else if (playerState != "powerless") {
      Battery.pc = 0;
      Battery.lvl = 0;
      playerState = "powerless";
      for (let d in Doors) {
        Doors[d].closed = false;
      }
    };

    // Jumpscare (?) :
    if (whoIsOn("43")[0]) {
      if (randomNumber(1, 25) == 1) {
        for (let intName in Intervals) clearInterval(Intervals[intName]);
        console.log("GAME OVER, BOT IN OFFICE");
      };
    }

    screen();

  }, 100);

  // STARTING THE SCREEN :

  function screenLoop() {
    stillGoing = screen();
    if (stillGoing && playerState == "alive") return screenLoop();
  }

  screenLoop();

}