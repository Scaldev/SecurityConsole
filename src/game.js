function start(night) {

  // ROUTING MAP :

  for (let square in Squares) {
    for (let n in Squares[square].neighbors) {
      let neighbor = Squares[square].neighbors[n];
      Squares[square].routing[neighbor] = [neighbor, 1];
    }
  }

  for (let i = 0; i < 12; i++) { // repeat 12 times the expansion
    for (let square in Squares) {
      for (let n in Squares[square].neighbors) {
        let neighbor = Squares[square].neighbors[n]; // for each neighbor of each square...
        for (let destination in Squares[neighbor].routing) { // check the neighbor's routing map
          if (!Squares[square].routing[destination] || Squares[square].routing[destination][1] > Squares[neighbor].routing[destination][1] + 1) { // and for every new square on the neighbor's routing map but not on the square's map...
            Squares[square].routing[destination] = [neighbor, Squares[neighbor].routing[destination][1] + 1]; // add that new square on the square map.
          }
        }
      }
    }
  }

  // BOTS :
  for (let n in BotsMoving) {
    Intervals[BotsMoving[n].name] = setInterval(() => { move(BotsMoving[n]); }, BotsMoving[n].interval * 1000);
  };

  // TASKS :
  for (let i = 0; i < Player.numberOfTasks; i++) {
    newTaskIndex = Math.floor(Math.random() * Tasks.length);
    newTask = Tasks[newTaskIndex];
    Player.tasks.push(newTask);
    Tasks.splice(newTaskIndex, 1);
  }

  // STARTING THE GAME :

  Intervals['eachHundredthOfSec'] = setInterval(() => {

    Sec += 0.01;

    // SOUND

    for (let square in Squares) {

      let nombre = randomNumber(0, 100);
      let diff = Rooms[getRoomName(square)].favoredNoiseLevel - Squares[square].noise;
      nombre += diff;
      if (Noise !== "") {
        let distFromSound = 5 - Squares[square].routing[Noise][1];
        if (distFromSound > 0) {
          nombre += Math.round(distFromSound * 1.5);
        }
      }

      if (square === Player.square) nombre += 10;
      if (Squares[Player.square].neighbors.includes(square)) nombre += 5;
      if (whoIsOn(square) !== '•') nombre += 5;

      if (nombre > 95 && Squares[square].noise < 10) Squares[square].noise += 1;
      if (nombre < 05 && Squares[square].noise > 01) Squares[square].noise -= 1;

    }

    // BATTERY
    if (Battery > 0) {
      Battery -= 0.003 * addPowerUsage();
    } else {
      if (Battery < 0) Battery = 0;
      if (Cam != "") Cam = "";
      if (Noise != "") Noise = "";
      if (Player.hiding) Player.hiding = false;
    }

    // SYSTEMS

    // Light system
    if (Battery > 0) {
      Systems['light'].usage += 0.01;
      if (randomNumber(0, 1000000) <= Systems['light'].usage) {
        Systems['light'].working = false;
      };
    }

    // Battery system
    if (Battery > 0 && Cam !== "") {
      Systems['cam'].usage += 0.01;
      if (randomNumber(0, 50000) <= Systems['cam'].usage) {
        Cam = "";
        Systems['cam'].working = false;
      }
    }

    // Noise system
    if (Battery > 0 && Noise !== "") {
      Systems['noise'].usage += 0.01;
      if (randomNumber(0, 50000) <= Systems['noise'].usage) {
        Noise = "";
        Systems['noise'].working = false;
      }
    }

    // Vent system
    if (Battery > 0 && (getRoomName(Player.square) === "VE" || getRoomName(Mangle.square) === "VE")) {
      Systems['vent'].usage += 0.01;
      if (randomNumber(0, 50000) <= Systems['vent'].usage) {
        Systems['vent'].working = false;
      }
    }

    for (let sys in Systems) {
      console.log(sys, " : usage of ", Systems[sys].usage)
    }
    console.log("--------------")

    screen();

  }, 10);

  // STARTING THE SCREEN :

  function screenLoop() {
    stillGoing = screen();
    if (stillGoing && Player.alive) return screenLoop();
  }

  screenLoop();

}