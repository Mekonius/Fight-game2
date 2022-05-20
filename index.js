const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 768;

ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "black";

let gameover =
  "<h1>Game Over</h1>" + '<button onclick="location.reload()">Restart</button>';

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity, color, offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 100;
    this.height = 150;
    this.color = color;
    this.lastKey;
    this.health = 100;  
    this.isAttacking;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: offset,
      width: 150,
      height: 50,
    };
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    if (this.isAttacking) {
      //attack box
      ctx.fillStyle = "yellow";
      ctx.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  color: "lightblue",
});

const enemy = new Sprite({
  position: {
    x: 500,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  color: "violet",
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

let timer = 10;

function decreaseTimer() {
  if (timer > 0) {
    setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
}

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  //player movement
  player.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x -= 5;
  }

  if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x += 5;
  }

  if (keys.w.pressed && player.lastKey === "w") {
    player.velocity.y += -1;
  }

  //enemy movement
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x -= 5;
  }

  if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x += 5;
  }

  if (keys.ArrowUp.pressed && enemy.lastKey === "ArrowUp") {
    enemy.velocity.y += -1;
  }

  // detect for collision
  function retangularCollision({ rect1, rect2 }) {
    return (
      rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
      rect1.attackBox.position.x <= rect2.position.x + rect2.attackBox.width &&
      rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
      rect1.attackBox.position.y <= rect2.position.y + rect2.attackBox.height
    );
  }

  if (
    retangularCollision({
      rect1: player,
      rect2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = true;
    enemy.health -= 10;
    document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    console.log("player hit 💀" + player.health);
  }

  if (
    retangularCollision({
      rect1: enemy,
      rect2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = true;
    player.health -= 10;
    document.querySelector('#playerHealth').style.width = enemy.health + '%';
    console.log("Enemy hit 🔥" + enemy.health);
  }

  // detect for game over
    if (player.health <= 0 || enemy.health <= 0 || timer <= 0) {
      document.querySelector('#displayText').innerHTML = gameover;
     if (player.health ===  enemy.health) {
        document.querySelector('#displayText').innerHTML = "Draw";
        document.querySelector('#displayText').style.display = 'flex'
      } else if (player.health >= enemy.health || enemy.health === 0) {
        document.querySelector('#displayText').innerHTML = "Player 1 Win";
        document.querySelector('#displayText').style.display = 'flex'
      } else if (player.health <= enemy.health || player.health === 0) {
        document.querySelector('#displayText').innerHTML = "Player 2 Win";
        document.querySelector('#displayText').style.display = 'flex'
      }
    }
}

animate();

window.addEventListener("keydown", (event) => {
  console.log(event.key);
  switch (event.key) {
    //player keys
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      keys.w.pressed = true;
      player.lastKey = "w";
      break;
    case " ":
      player.attack();
      break;

    // Enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = true;
      enemy.lastKey = "ArrowUp";
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  console.log(event.key);
  switch (event.key) {
    //player keys
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
    case " ":
      player.isAttacking = false;

    // Enemy keys

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
    case "ArrowDown":
      enemy.isAttacking = false;
      break;
  }
});
