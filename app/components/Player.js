/*
* Player module
*
*/

class IdentityPlayer extends Phaser.Sprite {

    constructor (game, x, y, image) {
        //this.player = this.add.sprite(5, 0, 'player');
        // conditional logic to choose placement and image
        // eg: load game level config
        super(game, x, y, image);

        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.set(0.5);
        this.enableBody = true;
        this.body.bounce.y = 0.2;
        this.body.gravity.y = game.gravity;
        this.body.collideWorldBounds = true;
    }

    // non-collision updates could go here:
}

export {IdentityPlayer}
