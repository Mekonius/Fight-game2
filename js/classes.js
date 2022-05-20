class Sprite {
    constructor({ position}) {
      this.position = position;
      this.width = 100;
      this.height = 150
    }
  
    draw() {}
  
    update() {
      this.draw();
    }
  
    attack() {
      this.isAttacking = true;
      setTimeout(() => {
        this.isAttacking = false;
      }, 100);
    }
  }

  class Fighter {
    constructor({ position, velocity, color, offset }) {
      this.position = position;
      this.velocity = velocity;
      this.width = 50;
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