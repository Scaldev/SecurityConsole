let Freddy = {
        initials: "FR",
        name: "Freddy",
        emoji: "🐻",
        level: 5,
        interval: 3.09,
        type: "move",
        square: "03",
        rooms: ["PS", "MS", "KI", "DR", "EN", "PC", "WA", "HW", "HE", "HS", "TO", "OF"]
    };

let Bonnie = {
        initials: "BO",
        name: "Bonnie",
        emoji: "🐰",
        level: 5,
        interval: 2.77,
        type: "move",
        square: "02",
        rooms: ["PS", "MS", "DR", "EN", "PC", "HW", "HS", "OF"]
    };

let Chica = {
        initials: "CH",
        name: "Chica",
        emoji: "🐔",
        level: 5,
        interval: 5.51,
        type: "move",
        square: "04",
        rooms: ["MS", "KI", "DR", "WA", "TO", "HE", "HS", "OF"]
    };

let Foxy = {
        initials: "FO",
        name: "Foxy",
        emoji: "🦊",
        level: 5,
        interval: 2.27,
        state: 0,
        goal: "",
        type: "move",
        square: "60",
        rooms: ["FC", "HS", "OF"]
    };

let Mangle = {
        initials: "MA",
        name: "Mangle",
        emoji: "🐺",
        level: 5,
        interval: 4.09,
        type: "move",
        square: "66",
        rooms:  ["PR", "VE", "SR", "FC", "HS", "HE", "HW", "OF", "TO", "WA", "PC", "EN", "DR"]
    };

let Bots = [Freddy, Bonnie, Chica, Foxy, Mangle];
let BotsMoving = Bots.filter(x => { return x.type == "move" });