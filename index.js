const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 768;

ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "black";

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity, color }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 100;
    this.height = 150;
    this.color = color;
    this.lastKey;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
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
}

animate();

window.addEventListener("keydown", (event) => {
  console.log(event.key);
  switch (event.key) {
    //player keys
    case "d":
      keys.d.pressed = true;
      player.lastKey = 'd';
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = 'a';
      break;
    case "w":
      keys.w.pressed = true;
      player.lastKey = 'w';
      break;
    // Enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = true;
      enemy.lastKey = 'ArrowUp';
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
  }
});
