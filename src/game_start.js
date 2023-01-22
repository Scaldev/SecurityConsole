function gameStart() {

  document.getElementById("textInput").style.display = "block";

  // RESTART :

  textInputState('usable', "enter a command here.");

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

  Freddy.square = "03";
  Bonnie.square = "02";
  Chica.square = "04";
  Foxy.square = "60";
  Mangle.square = "66";

  // TASKS :

  let maxTaskLevel = Player.tasksLevels[parseInt(localStorage.getItem('Night')) - 1];

  let totalLevel = 0;

  while (Math.abs(totalLevel - maxTaskLevel) > 2 && Tasks.length > 0) {

    let randomTaskIndex = Math.floor(Math.random() * Tasks.length);
    let randomTask = Tasks[randomTaskIndex];

    console.log(totalLevel, maxTaskLevel, Tasks.length, randomTask.steps[0].content, randomTask.difficulty, Player.tasks);

    if (totalLevel + randomTask.difficulty < maxTaskLevel) {
      totalLevel += randomTask.difficulty;
      Player.tasks.push(randomTask);
    }
    Tasks.splice(randomTask, 1);
  }

  Player.numberOfTasks = Player.tasks.length; // save the total number of tasks for the night

  console.log(Player.tasks)

  // STARTING THE GAME ###############################################################################

  Intervals['eachFrame'] = setInterval(() => {

    Sec += 0.01;

    if (whoIsOn(Player.square) !== '•' && !Player.hiding) { // a bot found the player
      gameOverKilled();

    } else if (Sec > 180 && Player.tasks.length !== 0) {
      gameOverFired();

    } else if (Player.tasks.length === 0) { // the player is done with tasks
      gameWin();

    } else { // the game keeps going
      gameFrame();
      screenFrame();
    }

  }, 1);

}