function fillTextMultiLine(ctx, text, x, y) {
  let lineHeight = ctx.measureText("M").width * 1.2;
  let lines = text.split("\n");
  for (let i = 0; i < lines.length; ++i) {
    ctx.fillText(lines[i], x, y);
    y += lineHeight;
  }
}

function drawCanvas(images) {

  // Clear :
  ctx.clearRect(0, 0, 600, 600);

  // ERROR ---------------------------------------------

  if (ErrorText) {
  textInput.placeholder = 'ERROR !';
  textInput.style.border = '2px solid #690000';
  textInput.style.backgroundImage = "url('imgs/prompt/prompt_red.png')";
  ctx.fillText(ErrorText, 360, 0);
  }

  // DATA ----------------------------------------------
  ctx.font = "16px Courier";
  ctx.textAlign = 'left';
  ctx.fillStyle = "white";
  text = "";
  hours = ["12", "1", "2", "3", "4", "5", "6"];
  hour = hours[Math.floor(Sec / 60)];
  text += `${hour} AM\n`;
  text += `(${Math.round(Sec)} seconds)\n`;
  text += `Battery : ${Math.ceil(Battery.pc)}%\n`;
  fillTextMultiLine(ctx, text, 100, 100);

  // MAP -----------------------------------------------

  ctx.drawImage(images['map_base'], 360, 30);

  // Doors :
  for (let d in Doors) {
    if (Doors[d].closed) ctx.drawImage((d == 'l' || d == 'r') ? images['door_v'] : images['door_h'], 360 + Doors[d].position[0], 30 + Doors[d].position[1]);
  }

  // Room names :
  ctx.font = "24px Courier";
  ctx.textAlign = 'center';
  ctx.fillStyle = "white";

  for (let room in Rooms) {
    if (Rooms[room].position[0]) {
      if (Cam != room) {
        ctx.fillText(room, 360 + Rooms[room].position[0], 30 + Rooms[room].position[1]);
      } else {
        botsHere = [];
        for (s in Rooms[room].squares) botsHere = botsHere.concat(whoIsOn(Rooms[room].squares[s]).map(x => x.emoji));
        ctx.fillText(`[${botsHere.join(' ')}]`, 360 + Rooms[room].position[0], 30 + Rooms[room].position[1]);
      }
    }
  }

}

function loadImages(names, files, onAllLoaded) {
  var i = 0, numLoading = files.length;
  const onload = () => --numLoading === 0 && onAllLoaded(images);
  const images = {};
  while (i < files.length) {
    const img = images[names[i]] = new Image;
    img.src = files[i++];
    img.onload = onload;
  }
  return images;
};

// SCREEN :

function screen() {

  loadImages(['map_base', 'door_h', 'door_v'], ['imgs/map_base.png', 'imgs/door_clo_h.png', 'imgs/door_clo_v.png'], drawCanvas);

}