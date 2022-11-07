function normalTextInput() {
  textInput.disabled = false;
  textInput.placeholder = 'enter a command here';
  textInput.style.border = '2px solid #006900';
  textInput.style.backgroundImage = "url('imgs/prompt/prompt_green.png')";
}

function returnError(text) {
  textInput.placeholder = 'ERROR !';
  textInput.style.border = '2px solid #690000';
  textInput.style.backgroundImage = "url('imgs/prompt/prompt_red.png')";
  ErrorText = text;

  setTimeout(() => {
    normalTextInput();
    ErrorText = text;
  }, timeToFix);

  ctx.fillText(text, 360, 0);
}

function command(input) {

  input = input.split(' ');
  doors_ini = ['l', 'r', 'f', 'b'];

  if (Battery.pc <= 0) return screen();

  switch (input[0]) {

    case 'cam':
      whichCam = input[1]?.toUpperCase();
      Cam = Rooms[whichCam] ? whichCam : "";
      break;

    case 'close': case 'open':
      if (Systems.door === false) {
        returnToRoom(text)
      }
      let d = input[1]?.toLowerCase();
      if (doors_ini.includes(d)) {
        Doors[d].closed = input[0] === 'close';
      }
      break;

    case 'fix':

      Cam = "";

      let textInput = document.getElementById("textInput");

      textInput.disabled = true;
      textInput.placeholder = 'fixing systems : please wait...';
      textInput.style.border = '2px solid #696969';
      textInput.style.backgroundImage = "url('imgs/prompt/prompt_gray.png')";

      whichSys = input[1]?.toLowerCase();
      timeSystems = { 'cam': 7500, 'door': 5000, 'vent': 6000, 'audio': 6000, 'all': 14000 };
      timeToFix = timeSystems[whichSys] ?? 1000;

      setTimeout(() => {

        if (Systems[whichSys]) {
          Systems[whichSys] = true;
        } else if (whichSys == "all") {
          Systems = { 'cam': true, 'door': true, 'vent': true, 'audio': true };
        }

        normalTextInput();

      }, timeToFix);

      break;

  };

  screen();

}