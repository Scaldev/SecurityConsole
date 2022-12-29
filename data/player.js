let startingFog = 1;
let Sec = 0;
let ErrorText = "";
let DotState = 0;
let LightState = 0;

let Player = {
    square: "43",
    alive: true,
    tasking: false,
    hiding: false,
    tasks: [],
    numberOfTasks: 0,
    tasksWeek: [2, 3, 5, 6, 8, 10]
}

// Tools :

let Noise = "";
let NoiseState = 0;

let Cam = "";

let Battery = 100.0;

let SabotageState = 0;
let Systems = {
    'cam': { name: 'Camera', working: true, square: '63', time: 6000, usage: 0 },
    'vent': { name: 'Ventilation', working: true, square: '26', time: 5000, usage: 0 },
    'noise': { name: 'Audio', working: true, square: '00', time: 7000, usage: 0 },
    'light': { name: 'Light', working: true, square: '43', time: 4000, usage: 0 },
};

let Intervals = {};

const Tasks = [

    // Parts and services
    [{ square: '00', step: 1, time: 2, content: "Store the material" }],
    [{ square: '01', step: 1, time: 4, content: "Clean the floor" }],
    [{ square: '10', step: 1, time: 5, content: "Clean the work surface" }],

    // Main stage
    [{ square: '02', step: 1, time: 5, content: "Tune Bonnie's guitar" }],
    [{ square: '03', step: 1, time: 5, content: "Tune Freddy's microphone" }],
    [{ square: '04', step: 1, time: 5, content: "Clean Chica's Cupecake" }],

    // Kitchen
    [{ square: '05', step: 1, time: 3, content: "Check for missing food" }],
    [{ square: '05', step: 1, time: 5, content: "Take the inventory" }, { square: '36', step: 2, time: 5, content: "Record the inventory" }],
    [{ square: '06', step: 1, time: 6, content: "Do the dishes" }],
    [{ square: '06', step: 1, time: 3, content: "Take some dishes" }, { square: '55', step: 2, time: 2, content: "Put clean dishes on the tables" }, { square: '56', step: 3, time: 2, content: "Put clean dishes on the tables" }],
    [{ square: '16', step: 1, time: 4, content: "Clean the floor" }],
    [{ square: '16', step: 1, time: 2, content: "Look tomorrow's menu" }, { square: '20', step: 1, time: 6, content: "Update the board's menu" }],

    // Dining room
    [{ square: '11', step: 1, time: 2, content: "Empty the trash can" }, { square: '26', step: 2, time: 2, content: "Dispose of waste" }],
    [{ square: '12', step: 1, time: 5, content: "Clean the curtains" }, { square: '14', step: 2, time: 5, content: "Clean the curtains" }],
    [{ square: '15', step: 1, time: 2, content: "Empty the trash can" }, { square: '26', step: 2, time: 2, content: "Dispose of waste" }],
    [{ square: '13', step: 1, time: 3, content: "Tidy up the table" }, { square: '23', step: 2, time: 3, content: "Tidy up the table" }],
    [{ square: '21', step: 1, time: 3, content: "Tidy up the table" }, { square: '22', step: 2, time: 3, content: "Tidy up the table" }],
    [{ square: '24', step: 1, time: 3, content: "Tidy up the table" }, { square: '25', step: 2, time: 3, content: "Tidy up the table" }],

    // Entrance
    [{ square: '20', step: 1, time: 3, content: "Empty the cash register" }, { square: '43', step: 2, time: 5, content: "Put the money in the safe" }],

    // Warehouse
    [{ square: '26', step: 1, time: 6, content: "Sort deliveries" }],
    [{ square: '26', step: 1, time: 3, content: "Take the toiler paper" }, { square: '45', step: 1, time: 3, content: "Store the toiler paper" }],
    [{ square: '35', step: 1, time: 5, content: "Wrapping gifts" }],
    [{ square: '36', step: 1, time: 4, content: "List orders" }],

    // Prize corner
    [{ square: '30', step: 1, time: 3, content: "Empty the cash register" }, { square: '43', step: 2, time: 5, content: "Put the money in the safe" }],
    [{ square: '31', step: 1, time: 6, content: "Rewind the music box" }],
    [{ square: '41', step: 1, time: 6, content: "Move products forward" }],

    // Hallway West
    [{ square: '32', step: 1, time: 4, content: "Clean the floor" }, { square: '42', step: 2, time: 4, content: "Clean the floor" }],

    // Hallway East
    [{ square: '34', step: 1, time: 4, content: "Clean the floor" }, { square: '44', step: 2, time: 4, content: "Clean the floor" }],

    // Office
    [{ square: '43', step: 1, time: 7, content: "Restart the computer" }],

    // Toilets
    [{ square: '45', step: 1, time: 4, content: "Clean the toilets" }],

    // Foxy's Cove
    [{ square: '50', step: 1, time: 4, content: "Turn off the arcade machines" }, { square: '51', step: 2, time: 4, content: "Turn off the arcade machines" }],
    [{ square: '61', step: 1, time: 4, content: "Clean the board" }],

    // Hallway South
    [{ square: '52', step: 1, time: 4, content: "Clean the floor" }, { square: '53', step: 2, time: 4, content: "Clean the floor" }, { square: '54', step: 1, time: 4, content: "Clean the floor" }],

    // Party Room
    [{ square: '55', step: 1, time: 4, content: "Clean the dance floor" }, { square: '56', step: 2, time: 4, content: "Clean the dance floor" }],
    [{ square: '65', step: 1, time: 4, content: "Clean the board" }],

    // Server Room
    [{ square: '63', step: 1, time: 8, content: "Restart the servers" }],

]