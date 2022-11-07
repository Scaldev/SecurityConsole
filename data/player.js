// GLOBAL (must be saved locally, so that refreshing the page won't delete data)

let Nights = 1;
let Deaths = 0;

// FOR THE NIGHT ONLY

let playerState = "alive";
let Sec = 0;
let Cam = "";
let CamTime = {};
let Battery = { 'pc': 10.0, 'lvl': 0 };
let Doors = {
    'l': { name: 'left', position: [190, 272], closed: false },
    'r': { name: 'right', position: [254, 272], closed: false },
    'f': { name: 'front', position: [208, 254], closed: false },
    'b': { name: 'behind', position: [208, 318], closed: false },
};
let Systems = { 'cam': true, 'door': true, 'vent': true, 'audio': true };
let ErrorText = "";
let Intervals = {};