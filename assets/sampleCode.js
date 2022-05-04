/*

This sample code was provided during a Launch School Code Jam by Katarina Rosiak.
Thanks, Katarina!

Katarina's github:
https://github.com/katarinarosiak
Launch School interview with Katarina
https://www.youtube.com/watch?v=MdR_8tCd0B8

*/

class Ruby {
  constructor() {
    this.x = 200;
    this.y = 200;
    this.width = 100;
    this.height = 100;
    this.element = document.getElementById('ruby');
  }
  draw(ctx) {
    if (this.randomNum(200) !== 4) {
      ctx.drawImage(this.element, this.x, this.y, this.width, this.height);
    } else {
      this.teleport();
    }
  }
  randomNum(until) {
    return Math.floor(Math.random() * until);
  }
  teleport() {
    this.x = this.randomNum(750);
    this.y = this.randomNum(750);
  }
}

class Hammer {
  constructor() {
    this.x = 400;
    this.y = 400;
    this.width = 100;
    this.height = 100;
    this.element = document.getElementById('hammer');
  }
  react(event) {
    if (event.key === 'ArrowUp') {
      this.moveUp();
    } else if (event.key === 'ArrowDown') {
      this.moveDown();
    } else if (event.key === 'ArrowRight') {
      this.moveRight();
    } else if (event.key === 'ArrowLeft') {
      this.moveLeft();
    }
  }
  draw(ctx) {
    ctx.drawImage(this.element, this.x, this.y, this.width, this.height);
  }
  moveUp() {
    this.y -= 10;
  }
  moveDown() {
    this.y += 10;
  }
  moveLeft() {
    this.x -= 10;
  }
  moveRight() {
    this.x += 10;
  }
}

class Game {
  constructor() {
    this.score = 0;
    this.hammer = new Hammer();
    this.ruby = new Ruby();
    this.canvas = document.getElementById('gameScreen');
    this.ctx = gameScreen.getContext('2d');
    document.addEventListener('keydown', (event) => {
      this.hammer.react(event);
    });
  }
  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawScore();
    this.ruby.draw(this.ctx);
    let hammer = this.hammer;
    this.hammer.draw(this.ctx);

    if (this.isCollision(this.hammer, this.ruby)) {
      this.score++;
      this.ruby.teleport();
      console.log('Boooooom!');
    }
    requestAnimationFrame(() => {
      this.update();
    });
  }
  drawScore() {
    this.ctx.font = '30px Arial';
    this.ctx.fillStyle = 'purple';
    this.ctx.fillText(`Score: ${this.score}`, 600, 50);
  }
  isCollision(hammer, ruby) {
    let rangeHammerX = this.createRange(hammer.x);
    let rangeHammerY = this.createRange(hammer.y);
    let rubyRangeX = this.createRange(ruby.x);
    let rubyRangeY = this.createRange(ruby.y);

    for (let i = 0; i <= rangeHammerX.length; i++) {
      return (
        rubyRangeX.includes(rangeHammerX[i]) &&
        rubyRangeY.includes(rangeHammerY[i])
      );
    }
  }
  createRange(num) {
    let range = [];
    for (let index = num; index <= num + 100; index++) {
      range.push(index);
    }
    return range;
  }
}

let game = new Game();

game.update();
