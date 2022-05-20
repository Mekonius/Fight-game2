const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 768;

ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "black";

let gameover =
  "<h1>Game Over</h1>" + '<button onclick="location.reload()">Restart</button>';

const gravity = 0.7;



const player = new Fighter({
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

const enemy = new Fighter({
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
  if (timer === 0 || player.health <= 0 || enemy.health <= 0) {
    document.querySelector('#displayText').style.display = 'flex'
    determineWinner({ player, enemy })
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

  function determineWinner({player, enemy}) {
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

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy })
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
