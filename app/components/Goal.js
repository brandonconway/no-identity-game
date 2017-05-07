/*
* Goal module
* logic surrounding the goal sprite and collision handlers for reaching the goal
*/
import {IdentityPlayer} from "./Player.js"


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

    glowHouse (player, house) {
        let tween, glow, adjust, tmp;
        if (!(house instanceof Goal)) {
            tmp = player;
            player = house;
            house = tmp;
        }
        player.can_jump = false;
        player.can_shoot = false;
        if (!this.goalMusic.isPlaying) {
            if (!player.reached_goal) {
                player.reached_goal = true;
                this.goalMusic.play();
            }
        }
        if (this.house.scale.x > 0){
            adjust = 30;
        }
        else {
            adjust = -50;
        }
        tween = this.add.tween(player.body).to(
            { x: this.house.x + adjust}, 100, Phaser.Easing.Default, true);
        tween = this.add.tween(player).to(
            { alpha: 0}, 200, Phaser.Easing.Default, true);
        glow = this.add.sprite(
            this.house.x + adjust, this.house.y+12, 'glow'
        );
        glow.alpha = 0.0;
        tween = this.add.tween(glow).to(
            {alpha: 0.03}, 200, Phaser.Easing.Default, true
        );
        tween.yoyo(true, 5);
        tween.onComplete.add(()=>{
            player.visible = false;
            player.body.x += player.scale.x * 12; // make sure all followers collide w/ goal
            player.body.immoveable = true;
        });
        if (!(player instanceof IdentityPlayer)) {
            player.visible = false;
            player.kill();
        }
    }

}


export {
    Goal
}
