/*
scoreboard:
3 numbers: 
  x streak counter (current string of consecutive hits), 
  x longest streak (longest string of consecutive hits)
  x score (raw points)
- Each smashed ruby is worth a flat 100 points
- Multiple hits without a miss create a combo streak
- Increasing the longest streak adds (streak)^3 to the score
  ex: if the longest combo is 3, and the player achieves a 5 streak:
    the player receives 100 points for each of the first 3 hits in the streak,
    then receives 100 + 4^3 points for the 4th hit, 
    and 100 + 5^3 points for the 5th hit.

  TODO: move hammer in smaller increments with keyboard
    AND THEN: open up ruby placement to include more locations
  
  TODO: Any streak adds (streak)^2 to the score.
  TODO: Center the board
  TODO: Make it look better & move the scoreboard
*/

const SCREEN_WIDTH = 700;
const SCREEN_HEIGHT = 700;
const HAMMER_RANGE = 33;
const SHORT_RUBY = 1500; // shortest possible ruby lifespan (ms)
const LONG_RUBY = 4000; // longest possible ruby lifespam (ms)
const SCOREBOARD_DIMENSIONS = [350, 500, 250, 100]; // [x, y, width, height]

let canvas;
let context;

let hammerObj = {
  id: document.getElementById('hammer'),
  x: 0,
  y: 0,
  boundsCheck() {
    if (this.x > SCREEN_WIDTH) this.x = SCREEN_WIDTH;
    if (this.x < 0) this.x = 0;
    if (this.y > SCREEN_HEIGHT) this.y = SCREEN_HEIGHT;
    if (this.y < 0) this.y = 0;
  },
};

let rubyObj = {
  id: document.getElementById('ruby'),
  x: 0,
  y: 0,
  birthday: 0,
  lifespan: 0,
  birth() {
    this.birthday = Date.now();
    this.lifespan = Math.floor(
      Math.random() * (LONG_RUBY - SHORT_RUBY) + SHORT_RUBY,
    );
    // division strips the 2 rightmost digits
    // this forces the ruby onto a grid
    this.x = Math.floor((Math.random() * (SCREEN_WIDTH + 100)) / 100) * 100;
    this.y = Math.floor((Math.random() * (SCREEN_HEIGHT + 100)) / 100) * 100;
  },
  isDead() {
    return Date.now() > this.birthday + this.lifespan;
  },
};

let scoreboard = {
  score: 0,
  comboLongest: 0,
  comboCounter: 0,
  hit() {
    this.comboCounter++;
    this.score += 100;
    if (this.comboCounter > this.comboLongest) {
      this.comboLongest = this.comboCounter;
      this.score += this.comboLongest ** 3;
    }
  },
  miss() {
    this.comboCounter = 0;
  },
  draw() {
    //using offsets from the const allows the board to be moved easily
    context.strokeRect(...SCOREBOARD_DIMENSIONS);
    context.fillText(
      `Combo ${this.comboCounter}`,
      SCOREBOARD_DIMENSIONS[0] + 59,
      SCOREBOARD_DIMENSIONS[1] + 25,
    );
    context.fillText(
      `Longest ${this.comboLongest}`,
      SCOREBOARD_DIMENSIONS[0] + 185,
      SCOREBOARD_DIMENSIONS[1] + 25,
    );
    context.fillText(
      `score`,
      SCOREBOARD_DIMENSIONS[0] + 125,
      SCOREBOARD_DIMENSIONS[1] + 55,
    );
    context.fillText(
      this.score,
      SCOREBOARD_DIMENSIONS[0] + 125,
      SCOREBOARD_DIMENSIONS[1] + 85,
    );
  },
};

window.onload = init;

function init() {
  canvas = document.getElementById('gameScreen');
  context = canvas.getContext('2d');
  context.font = '23px Helvetica, sans-serif';
  context.textAlign = 'center';
  context.fillStyle = 'black';
  rubyObj.birth();

  window.requestAnimationFrame(gameLoop);
}

function gameLoop() {
  hammerObj.boundsCheck();
  if (rubyObj.isDead()) {
    scoreboard.miss();
    rubyObj.birth();
  }

  draw();

  window.requestAnimationFrame(gameLoop);
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(rubyObj.id, rubyObj.x, rubyObj.y, 50, 50);
  context.drawImage(hammerObj.id, hammerObj.x, hammerObj.y, 50, 50);
  scoreboard.draw();
}

document.addEventListener('keydown', keyboardHammer);
document.addEventListener('mousemove', mouseHammer);
document.addEventListener('mousedown', smashCheck);

function smashCheck() {
  if (
    Math.abs(hammerObj.x - rubyObj.x) < HAMMER_RANGE &&
    Math.abs(hammerObj.y - rubyObj.y) < HAMMER_RANGE
  ) {
    scoreboard.hit();
    rubyObj.birth();
  } else {
    scoreboard.miss();
  }
}

function mouseHammer(e) {
  hammerObj.x = e.pageX - 25;
  hammerObj.y = e.pageY - 25;
}

function keyboardHammer(e) {
  switch (e.key) {
    case 'ArrowUp':
      hammerObj.y -= 100;
      break;
    case 'ArrowDown':
      hammerObj.y += 100;
      break;
    case 'ArrowLeft':
      hammerObj.x -= 100;
      break;
    case 'ArrowRight':
      hammerObj.x += 100;
      break;
    case ' ':
      smashCheck();
      break;
  }
}
