function start() {

  document.getElementById("textInput").style.display = "block";

  // RESTART :

  startingFog = 1;
  Sec = 0;
  ErrorText = "";
  DotState = 0;
  LightState = 0;
  Player = { square: "43", alive: true, tasking: false, hiding: false, tasks: [], numberOfTasks: 0, tasksWeek: [2, 3, 5, 7, 9] };
  Noise = "";
  NoiseState = 0;
  Cam = "";
  Battery = 100.0;
  SabotageState = 0;
  Intervals = {};
  Systems = {
    'cam': { name: 'Camera', working: true, square: '63', time: 6000, usage: 0 },
    'vent': { name: 'Ventilation', working: true, square: '26', time: 5000, usage: 0 },
    'noise': { name: 'Audio', working: true, square: '00', time: 7000, usage: 0 },
    'light': { name: 'Light', working: true, square: '43', time: 4000, usage: 0 },
  };

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

  for (let n in Bots) {
    Intervals[Bots[n].name] = setInterval(() => { move(Bots[n]); }, Bots[n].interval * 1000);
    Bots[n].level = Bots[n].levels[parseInt(localStorage.getItem('Night')) - 1]
  };

  Freddy.square = "04";
  Bonnie.square = "03";
  Chica.square = "05";
  Foxy.square = "60";
  Mangle.square = "66";

  // TASKS :

  Player.numberOfTasks = Player.tasksWeek[parseInt(localStorage.getItem('Night')) - 1]

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

    screen();

  }, 10);

  // STARTING THE SCREEN :

  function screenLoop() {
    stillGoing = screen();
    if (stillGoing && Player.alive) return screenLoop();
  }

  screenLoop();

}