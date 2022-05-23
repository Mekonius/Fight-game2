function decreaseTimer() {
    if (timer > 0) {
        setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector("#timer").innerHTML = timer;
    }
    if (timer === 0 || player.health <= 0 || enemy.health <= 0) {
        document.querySelector('#displayText').style.display = 'flex';
        determineWinner({ player, enemy });
    }
}

function animate() {
    window.requestAnimationFrame(animate);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ASSETS
    background.update();
    shop.update();

    // PLAYERS
    player.update();
    enemy.update();
    
    //player movement
    player.velocity.x = 0;
    player.switchSprites("idle");

    if (keys.a.pressed && player.lastKey === "a") {
        player.switchSprites("run");
        player.velocity.x -= 5;
    }

    if (keys.d.pressed && player.lastKey === "d") {
        player.switchSprites("run");
        player.velocity.x += 5;
    }
    
    if (player.velocity.y < 0) {
        player.switchSprites("jump");
    } else if (player.velocity.y > 0) {
        player.switchSprites("fall");
    }


    //enemy movement
    enemy.velocity.x = 0;
    enemy.switchSprites("idle");

    
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x -= 5;
    }

    if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x += 5;
    }

    if (keys.ArrowUp.pressed && enemy.lastKey === "ArrowUp") {
        enemy.velocity.y += -1;
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
        document.querySelector("#enemyHealth").style.width = enemy.health + "%";
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
        document.querySelector("#playerHealth").style.width = player.health + "%";
        console.log("Enemy hit 🔥" + enemy.health);
    }

    if (enemy.health <= 0 || player.health <= 0 || timer <= 0) {
        determineWinner({ player, enemy });
    }
}

function determineWinner({ player, enemy }) {
    if (player.health <= 0 || enemy.health <= 0 || timer <= 0) {
        document.querySelector('#displayText').innerHTML = gameover;
        if (player.health === enemy.health) {
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

function retangularCollision({ rect1, rect2 }) {
    return (
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
        rect1.attackBox.position.x <= rect2.position.x + rect2.attackBox.width &&
        rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
        rect1.attackBox.position.y <= rect2.position.y + rect2.attackBox.height
    );
}