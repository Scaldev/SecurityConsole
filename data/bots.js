let Freddy = {
        initials: "FR",
        name: "Freddy",
        emoji: "🐻",
        level: 10,
        interval: 3.09,
        type: "move",
        square: "03"
    };

let Bonnie = {
        initials: "BO",
        name: "Bonnie",
        emoji: "🐰",
        level: 20,
        interval: 2.77,
        type: "move",
        square: "02"
    };

let Chica = {
        initials: "CH",
        name: "Chica",
        emoji: "🐔",
        level: 10,
        interval: 5.51,
        type: "move",
        square: "04"
    };

let Foxy = {
        initials: "FO",
        name: "Foxy",
        emoji: "🦊",
        level: 10,
        interval: 2.07,
        state: 0,
        goal: "",
        type: "move",
        square: "60"
    };

let Mangle = {
        initials: "MA",
        name: "Mangle",
        emoji: "🐺",
        level: 10,
        interval: 4.09,
        type: "move",
        square: "66"
    };

let Bots = [Freddy, Bonnie, Chica, Foxy, Mangle];
let BotsMoving = Bots.filter(x => { return x.type == "move" });