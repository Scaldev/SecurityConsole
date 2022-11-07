let Freddy = {
        initials: "FR",
        name: "Freddy",
        emoji: "🐻",
        level: 6,
        interval: 5.09,
        type: "move",
        doors: ["l", "r", "b"],
        square: "03",
        restartRoom: "MS",
        rooms: ["PS", "MS", "KI", "DR", "EN", "PC", "WA", "HW", "HE", "HS", "TO", "OF"],
        mapPath: { "43": ["43", 0] }
    };

let Bonnie = {
        initials: "BO",
        name: "Bonnie",
        emoji: "🐰",
        level: 7,
        interval: 4.07,
        type: "move",
        doors: ["l", "b"],
        square: "02",
        restartRoom: "DR",
        rooms: ["PS", "MS", "DR", "EN", "PC", "HW", "HS", "OF"],
        mapPath: { "43": ["43", 0] }
    };

let Chica = {
        initials: "CH",
        name: "Chica",
        emoji: "🐔",
        level: 10,
        interval: 9.51,
        type: "move",
        doors: ["r", "b"],
        square: "04",
        restartRoom: "KI",
        rooms: ["MS", "KI", "DR", "WA", "TO", "HE", "HS", "OF"],
        mapPath: { "43": ["43", 0] }
    };

let Foxy = {
        initials: "FO",
        name: "Foxy",
        emoji: "🦊",
        level: 15,
        interval: 5.27,
        state: 0,
        type: "move",
        doors: ["b"],
        square: "60",
        restartRoom: "FC",
        rooms: ["FC", "HS", "OF"],
        mapPath: { "43": ["43", 0] }
    };

let Mangle = {
        initials: "MA",
        name: "Mangle",
        emoji: "🐺",
        level: 5,
        interval: 6.09,
        type: "move",
        doors: ["f"],
        square: "66",
        restartRoom: "PR",
        rooms:  ["PR", "VE", "SR", "FC", "HS", "HE", "HW", "OF", "TO", "WA", "PC", "EN", "DR"],
        mapPath: { "43": ["43", 0] }
    };

let Bots = [Freddy, Bonnie, Chica, Foxy, Mangle];
let BotsMoving = Bots.filter(x => { return x.type == "move" });