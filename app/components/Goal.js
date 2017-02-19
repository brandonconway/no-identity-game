/*
* Goal module
* logic surrounding the goal sprite and collision handlers for reaching the goal
*/

class Goal extends Phaser.Sprite {

    constructor (game, x, y, image) {
        // level-specific logic here

        super(game, x, y, image);
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.scale.setTo(1.75, 1.75);
        this.scale.x *= -1;
        this.enableBody = true;
        this.body.immovable = true
    }
}


export {
    Goal
}
