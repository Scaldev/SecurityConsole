function gameFrame() {

    // SOUND #################################################################################
    
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
        if (Squares[Player.square].neighbors.includes(square)) nombre += Player.hiding ? 2 : 5;
        if (whoIsOn(square) !== '•') nombre += 5;

        if (nombre > 95 && Squares[square].noise < 10) Squares[square].noise += 1;
        if (nombre < 05 && Squares[square].noise > 01) Squares[square].noise -= 1;

    }

    // BATTERY #############################################################################
    
    if (Battery > 0) {
        Battery -= 0.003 * addPowerUsage();
    } else {
        if (Battery < 0) Battery = 0;
        if (Cam != "") Cam = "";
        if (Noise != "") Noise = "";
        if (Player.hiding) Player.hiding = false;
    }

     // SYSTEMS #############################################################################
    
     let nightNumber = parseInt(localStorage.getItem('Night'));

     // Light system
    if (nightNumber > 1 && Systems['light'].working && Battery > 0) {
        Systems['light'].usage += 0.001 * nightNumber;
        if (randomNumber(0, 10000000) <= Systems['light'].usage) {
            Systems['light'].working = false;
        };
    }

    // Battery system
    if (nightNumber > 1 && Systems['cam'].working && Battery > 0 && Cam !== "") {
        Systems['cam'].usage += 0.001 * nightNumber;
        if (randomNumber(0, 500000) <= Systems['cam'].usage) {
            Cam = "";
            Systems['cam'].working = false;
        }
    }

    // Noise system
    if (nightNumber > 1 && Systems['noise'].working && Battery > 0 && Noise !== "") {
        Systems['noise'].usage += 0.001 * nightNumber;
        if (randomNumber(0, 500000) <= Systems['noise'].usage) {
            Noise = "";
            Systems['noise'].working = false;
        }
    }

    // Vent system
    if (nightNumber > 1 && Systems['vent'].working && Battery > 0 && (getRoomName(Player.square) === "VE" || getRoomName(Mangle.square) === "VE")) {
        Systems['vent'].usage += 0.001 * nightNumber;
        if (randomNumber(0, 500000) <= Systems['vent'].usage) {
            Systems['vent'].working = false;
        }
    }

    // Task system
    if (nightNumber > 1 && Systems['task'].working) {
        Systems['noise'].usage += 0.0001 * nightNumber;
        if (randomNumber(0, 500000) <= Systems['task'].usage) {
            Noise = "";
            Systems['task'].working = false;
        }
    }

}