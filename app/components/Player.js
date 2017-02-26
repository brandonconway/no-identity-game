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

    update () {
        let cursors = this.game.cursors;
        if (cursors.left.isDown)
        {
            this.body.velocity.x = -70;
            this.scale.x = 1;
            this.game.groupers.children.forEach((person, index)=>{
                if (person.body.touching.down) {
                    this.game.physics.arcade.moveToObject(person, this, 60+(index*10));
                }
            });
        }
        else if (cursors.right.isDown)
        {
            this.body.velocity.x = 70;
            this.scale.x = -1;
            this.game.groupers.children.forEach((person, index)=>{
                if (person.body.touching.down) {
                    this.game.physics.arcade.moveToObject(person, this, 60+(index*10));
                }
            });
        }
        else {
            this.body.velocity.x = 0;
            this.game.groupers.children.forEach((person, index)=>{
                if (person.body.touching.down) {
                    this.game.physics.arcade.moveToObject(person, this, 60+index);
                }
            });
        }
    }

}


export {IdentityPlayer}
