class Sprite {
    constructor({
        position,
        imageSrc,
        width,
        height,
        scale = 1,
        framesMax = 1
    }) {
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
            this.image.width / this.framesMax * this.scale,
            this.image.height * this.scale
        );
    }

    animateFrames() {
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
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color,
        offset,
        imageSrc,
        scale = 1,
        framesMax = 1,
        sprites
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax
        });
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
                y: this.position.y
            },
            offset: offset,
            width: 150,
            height: 50
        };
        this.framesElapsed = 0;
        this.framesCurrent = 0;
        this.framesHold = 10;
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = this.sprites[sprite].imageSrc;
        }

        console.log(this.sprites);
    }

    update() {
        this.draw();
        
        if(!this.dead) {
            this.animateFrames();
        }

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
        this.switchSprites('attack');
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }

    takeHit() {
        this.health -= 20;
        if (this.health <= 0) {
            console.log('dead');
            this.dead = true
            this.switchSprites('death');
        }
    }


    switchSprites(sprite) {
        // Play death animation if health is 0
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1) {
                this.dead = true;
            }
            return;
        }

        if (this.image === this.sprites.attack.image && this.framesCurrent < this.sprites.attack.framesMax - 1) return;

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                this.image = this.sprites.idle.image;
                this.framesMax = this.sprites.idle.framesMax;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                this.image = this.sprites.run.image;
                this.framesMax = this.sprites.run.framesMax;
                }
                break;
            case 'jump':
                if(this.image !== this.sprites.jump.image) {
                this.image = this.sprites.jump.image;
                this.framesMax = this.sprites.jump.framesMax;
                this.framesCurrent = 0;
                }
                break;
            case 'fall':
                if(this.image !== this.sprites.fall.image) {
                this.image = this.sprites.fall.image;
                this.framesMax = this.sprites.fall.framesMax;
                }
                break;
            case 'attack':
                if(this.image !== this.sprites.attack.image) {
                this.image = this.sprites.attack.image;
                this.framesMax = this.sprites.attack.framesMax;
                this.framesCurrent = 0;
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                this.image = this.sprites.death.image;
                this.framesMax = this.sprites.death.framesMax;
                this.framesCurrent = 0;
                }
                break

        }
    }
}