class Sprite {
    constructor({ position, imageSrc, width, height, scale = 1, framesMax = 1 }) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
    }

    draw() {
        ctx.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax, 
            this.image.height,
            this.position.x,    
            this.position.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }

    animateFrames(){
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames()
    }   
}

class Fighter extends Sprite {
    constructor({ position, velocity, color, offset, imageSrc, scale = 1, framesMax = 1, sprites }) {
        super({ position, imageSrc, scale, framesMax });
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
        this.framesElapsed = 0
        this.framesCurrent = 0
        this.framesHold = 10
        this.sprites = sprites;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = this.sprites[sprite].imageSrc;
        }

        console.log(this.sprites);
    }

    update() {
        this.draw();
        this.animateFrames()
        

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height >= canvas.height - 270) {
            this.velocity.y = 0;
            this.position.y = canvas.height - 270 - this.height;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 1000);
    }


    switchSprites(sprite) {
        // if 
        // (
        //     this.image === this.sprites.idle.image && 
        //     this.framesCurrent < this.sprites.idle.frameMax -1
        // ) 
        // return ;

        switch (sprite) {
            case "idle":
                this.image = this.sprites.idle.image;
                this.framesMax = this.sprites.idle.framesMax;
                break;
            case "run": 
                this.image = this.sprites.run.image;
                this.framesMax = this.sprites.run.framesMax;
                break;
            case "jump":
                this.image = this.sprites.jump.image;
                this.framesMax = this.sprites.jump.framesMax;
                this.framesCurrent = 0;
                break;
            case "fall":
                this.image = this.sprites.fall.image;
                this.framesMax = this.sprites.fall.framesMax;
                break;
        }        
    }
}