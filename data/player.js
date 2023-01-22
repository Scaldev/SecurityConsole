var StartingFog = 1;
var Sec = 0;
var DotState = 0;
var LightState = 0;

var Player = {
    square: "43",
    alive: true,
    tasking: false,
    hiding: false,
    tasks: [],
    numberOfTasks: 0,
    tasksLevels: [9, 14, 20, 27, 35, 50]
}

// Tools :

var Noise = "";
var NoiseState = 0;

var Cam = "";

var Battery = 100.0;

var SabotageState = 0;
var Systems = {
    'cam': { name: 'Camera', working: true, square: '63', time: 6, usage: 0 },
    'vent': { name: 'Ventilation', working: true, square: '26', time: 5, usage: 0 },
    'noise': { name: 'Audio', working: true, square: '00', time: 7, usage: 0 },
    'light': { name: 'Light', working: true, square: '30', time: 3, usage: 0 },
    'task': { name: 'Tasks', working: true, square: '43', time: 4, usage: 0 },
};

var Intervals = {};

var Tasks = [

    // Parts and services
    { difficulty: 3, numberOfSteps: 1, steps: [{ square: "00", time: 3, content: "Store the material" }] },
    { difficulty: 7, numberOfSteps: 2, steps: [{ square: "00", time: 2, content: "Take the wrench" }, { square: "63", time: 5, content: "Fix the circuit boards" }] },
    { difficulty: 4, numberOfSteps: 1, steps: [{ square: "01", time: 4, content: "Clean the floor" }] },
    { difficulty: 4, numberOfSteps: 1, steps: [{ square: "10", time: 5, content: "Clean the work surface" }] },

    // Main stage
    { difficulty: 7, numberOfSteps: 1, steps: [{ square: "02", time: 5, content: "Tune Bonnie's guitar" }] },
    { difficulty: 8, numberOfSteps: 1, steps: [{ square: "03", time: 6, content: "Tune Freddy's microphone" }] },
    { difficulty: 7, numberOfSteps: 1, steps: [{ square: "04", time: 5, content: "Clean Chica's cupecake" }] },

    // Kitchen
    { difficulty: 5, numberOfSteps: 1, steps: [{ square: "05", time: 3, content: "Check for missing food" }] },
    { difficulty: 4, numberOfSteps: 2, steps: [{ square: "05", time: 2, content: "Take a snack" }, { square: "45", time: 2, content: "Put the snack on the table" }] },
    { difficulty: 7, numberOfSteps: 2, steps: [{ square: "05", time: 5, content: "Take the inventory" }, { square: "36", time: 4, content: "Record the inventory" }] },
    { difficulty: 4, numberOfSteps: 1, steps: [{ square: "06", time: 6, content: "Do the dishes" }] },
    { difficulty: 8, numberOfSteps: 3, steps: [{ square: "06", time: 4, content: "Take some dishes" }, { square: "55", time: 3, content: "Put clean dishes on the tables" }, { square: "56", time: 3, content: "Put clean dishes on the tables" }] },
    { difficulty: 2, numberOfSteps: 1, steps: [{ square: "16", time: 4, content: "Clean the floor" }] },
    { difficulty: 6, numberOfSteps: 2, steps: [{ square: "16", time: 2, content: "Look tomorrow's menu" }, { square: "20", time: 6, content: "Update the board's menu" }] },

    // Dining room
    { difficulty: 7, numberOfSteps: 2, steps: [{ square: "11", time: 3, content: "Empty the trash can" }, { square: '26', time: 3, content: "Dispose of waste" }] },
    { difficulty: 8, numberOfSteps: 2, steps: [{ square: "12", time: 4, content: "Clean the curtains" }, { square: '14', time: 4, content: "Clean the curtains" }] },
    { difficulty: 7, numberOfSteps: 2, steps: [{ square: "15", time: 3, content: "Empty the trash can" }, { square: '26', time: 3, content: "Dispose of waste" }] },
    { difficulty: 6, numberOfSteps: 2, steps: [{ square: "13", time: 3, content: "Clean the table" }, { square: '26', time: 3, content: "Clean the table" }] },
    { difficulty: 6, numberOfSteps: 2, steps: [{ square: "21", time: 3, content: "Clean the table" }, { square: '22', time: 3, content: "Clean the table" }] },
    { difficulty: 6, numberOfSteps: 2, steps: [{ square: "24", time: 3, content: "Clean the table" }, { square: '25', time: 3, content: "Clean the table" }] },

    // Entrance
    { difficulty: 6, numberOfSteps: 2, steps: [{ square: "20", time: 3, content: "Empty the cash register" }, { square: '43', time: 5, content: "Put the money in the safe" }] },
    { difficulty: 3, numberOfSteps: 1, steps: [{ square: "20", time: 5, content: "Dust the furniture" }] },

    // Warehouse
    { difficulty: 3, numberOfSteps: 1, steps: [{ square: "26", time: 6, content: "Sort deliveries" }] },
    { difficulty: 6, numberOfSteps: 2, steps: [{ square: "26", time: 6, content: "Take the toivar paper" }, { square: "45", time: 3, content: "Store the toiler paper" }] },
    { difficulty: 6, numberOfSteps: 1, steps: [{ square: "35", time: 7, content: "Wrapping gifts" }] },
    { difficulty: 3, numberOfSteps: 1, steps: [{ square: "36", time: 4, content: "List orders" }] },

    // Prize corner
    { difficulty: 6, numberOfSteps: 2, steps: [{ square: "30", time: 3, content: "Empty the cash register" }, { square: '43', time: 5, content: "Put the money in the safe" }] },
    { difficulty: 7, numberOfSteps: 1, steps: [{ square: "31", time: 8, content: "Rewind the music box" }] },
    { difficulty: 4, numberOfSteps: 1, steps: [{ square: "41", time: 5, content: "Move products forward" }] },

    // Hallway West
    { difficulty: 6, numberOfSteps: 2, steps: [{ square: "32", time: 4, content: "Clean the floor" }, { square: "42", time: 4, content: "Clean the floor" }] },

    // Hallway East
    { difficulty: 6, numberOfSteps: 2, steps: [{ square: "34", time: 4, content: "Clean the floor" }, { square: "44", time: 4, content: "Clean the floor" }] },

    // Office
    { difficulty: 6, numberOfSteps: 1, steps: [{ square: "43", time: 7, content: "Restart the computer" }] },
    { difficulty: 2, numberOfSteps: 1, steps: [{ square: "43", time: 4, content: "Clean the desk" }] },

    // Toilets
    { difficulty: 2, numberOfSteps: 1, steps: [{ square: "45", time: 4, content: "Clean the toilets" }] },

    // Foxy's Cove
    { difficulty: 9, numberOfSteps: 2, steps: [{ square: "50", time: 4, content: "Turn off the arcade machines" }, { square: "51", time: 4, content: "Turn off the arcade machines" }] },
    { difficulty: 7, numberOfSteps: 1, steps: [{ square: "61", time: 5, content: "Clean the board" }] },

    // Hallway South
    { difficulty: 9, numberOfSteps: 3, steps: [{ square: "52", time: 4, content: "Clean the floor" }, { square: "53", time: 4, content: "Clean the floor" }, { square: "54", time: 4, content: "Clean the floor" }] },

    // Party Room
    { difficulty: 9, numberOfSteps: 2, steps: [{ square: "55", time: 4, content: "Clean the dance floor" }, { square: "56", time: 4, content: "Clean the dance floor" }] },
    { difficulty: 7, numberOfSteps: 1, steps: [{ square: "65", time: 5, content: "Clean the board" }] },

    // Server Room
    { difficulty: 8, numberOfSteps: 1, steps: [{ square: "63", time: 10, content: "Restart the servers" }] },

]