/*
* Player module
*
*/

class IdentityPlayer extends Phaser.Sprite {

    constructor (game, x, y, image, options) {
        //this.player = this.add.sprite(5, 0, 'player');
        // conditional logic to choose placement and image
        // eg: load game level config
        super(game, x, y, image);

        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.set(0.5, 1);
        this.enableBody = true;
        this.can_move = true;
        this.is_firing = false;
        this.isTeleporting = false;
        this.body.bounce.y = 0.2;
        this.body.bounce.x = 0.2;
        this.body.gravity.y = game.gravity;
        this.body.velocity.y = 0;
        this.body.collideWorldBounds = true;
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.shootButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        if (options != undefined) {
            if (options.can_shoot != undefined) {
                this.can_shoot = options.can_shoot;
            }
            if (options.can_jump != undefined) {
                this.can_jump = options.can_jump;
            }
        }
    }

    update () {

        let cursors = this.game.cursors;
        if (this.can_move) {
            if (cursors.left.isDown)
            {
                this.moveLeft();
            }
            else if (cursors.right.isDown)
            {
                this.moveRight();
            }
            else {
                this.body.velocity.x = 0;
            }

            if (this.jumpButton.isDown && this.can_jump && this.body.touching.down) {
        	    this.jump();
                this.is_jumping = true;
            }
            else {
                this.is_jumping = false;
            }
            if (this.shootButton.isDown && this.can_shoot && !this.is_firing){
                this.fireBlast();
            }
            if (this.shootButton.isUp && this.can_shoot) {
                this.is_firing = false;
            }
        }
    }

    moveRight () {
        this.body.velocity.x = 60;
        this.scale.x = -1;
        // add animations
    }

    moveLeft () {
        this.body.velocity.x = -60;
        this.scale.x = 1;
        // add animations
    }

    jump () {
        this.body.velocity.y -= 400;
        // add animations
    }

    fireBlast () {
        /*if(!this.shoot_sound.isPlaying){
           this.shoot_sound.play();
       }*/
       if (!this.is_firing) {
           this.is_firing = true;
           this.body.moves = false;
           let tween, offsetY, size;
           offsetY = 30; // move to circle in body
           this.blast = this.game.add.sprite(this.body.center.x, this.body.y+offsetY, 'ground');
           this.blast.scale.y = 0.5;
           this.blast.enableBody = true;
           this.game.physics.enable(this.blast, Phaser.Physics.ARCADE);
           // try other easings?
           size = this.scale.x * -20;
           tween = this.game.add.tween(this.blast.scale).to(
                   { x:  size},
                   500, "Linear", true);
           tween.onComplete.add(()=>{
                this.blast.kill();
                this.body.moves = true;
            });
        }
    }

}


export {IdentityPlayer}
