import {MainMenu} from "./states/MainMenu.js"

// Game class

class Game extends Phaser.Game {

    constructor (width=1024, height=764, renderer, el) {
        super(width, height, Phaser.AUTO, el, null);

        this.headerStyle = {
            font: "bold 32px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        }
        this.textStyle = {
            font: "bold 18px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        }
        this.total_levels = 5;

    }

    loseGame () {
        // Necessary logic when the game is lost
        // returns: a phaser game state
    }

    winLevel (collider, goal) {
        // Necessary logic when passing a level.
        // returns: a phaser game state
        if (!this.complete) {
            this.complete = true;
            this.goalMusic.play();
            this.mainMusic.loop = false;
            this.mainMusic.stop();
            this.game.win_text.visible = true; // use WinText method
            this.player.kill();
            collider.kill();
            if (this.level + 1 > this.game.total_levels) {
                setTimeout(() => {
                    this.state.start('MainMenu'); // Call EndGame state instead
                }, 1500);
            }
            else { // go to next level
                setTimeout(() => {
                        this.state.start('LevelMenu', true, false, this.level+1);
                    }, 1500);
            }
        }
    }

    completeGame () {
        // Necessary logic when completing game.
        // returns: a phaser game state
    }

    addTouch(game) {
        let cursors, rightButton, leftButton;
        cursors = game.cursors;

        if (game.device.touch) {
            rightButton = this.add.sprite(
                                         game.width-40,
                                         game.height/2, 'playButton');
            rightButton.inputEnabled = true;
            rightButton.scale.setTo(2,2);
            rightButton.events.onInputDown.add(onDown,
                {'direction': 'right',
                'cursors': cursors});

            leftButton = this.add.sprite(
                                          40,
                                          game.height/2, 'playButton');
            leftButton.inputEnabled = true;
            leftButton.scale.setTo(2,2);
            leftButton.scale.x *= -1;

            leftButton.events.onInputDown.add(onDown,
                {'direction': 'left',
                'cursors': cursors});

            leftButton.events.onInputUp.add(onUp, {'cursors': cursors});
            rightButton.events.onInputUp.add(onUp, {'cursors': cursors});
        }

        function onDown(sprite, pointer) {
            if (this.direction == 'left') {
                this.cursors.left.isDown = true;
            }
            if (this.direction == 'right'){
                this.cursors.right.isDown = true;
            }
        }

        function onUp(){
            this.cursors.left.isDown = false;
            this.cursors.right.isDown = false;
        }
    }

    addIdentityBar (identity_level) {
        // this should extend sprite
        let x, y, width, height, text, style, i, bar, identity_bar;

        identity_bar = {};
        identity_bar.bar = [];
        style = {
            font: "10px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        x = 80;
        y = 4;
        width = 10;
        height = 10;

        identity_bar.text = new Phaser.Text(this, x, y, "Identity level", style);
        identity_bar.text.anchor.set(1, 0);
        x+=3;
        this.add.existing(identity_bar.text);

        for (i=0; i<identity_level; i++){
            bar = this.add.graphics(1, 1);
            bar.beginFill(0xFFFFFF);
            bar.drawRect(x, y, width, height);
            bar.endFill();
            x+=width+1;
            identity_bar.bar.push(bar);
        }
        return identity_bar;
    }

    addFullScreenButton () {
        if(!this.scale.isFullScreen) {
            var game;
            game = this;
            this.fullButton = this.add.button(this.width-10, 10,
                                     'fullScreenButton',
                                     this.enterFullScreen, this
                                 );
            this.fullButton.anchor.set(0.5);
            this.scale.onFullScreenChange.add(function() {
                game.fullButton.visible = !game.scale.isFullScreen;
            });
        }
    }

    enterFullScreen (button) {
        this.scale.startFullScreen(false);
        this.scale.refresh();
    }

    pauseGame (button) {
        this.game.paused = true;
        this.input.onDown.add(this.game.unPauseGame, this);
        this.unPauseButton = this.game.add.button(this.width/2, this.height/2,
                        'playButton', this.unPauseGame, this);
    }

    unPauseGame (button) {
        if (this.game.paused) {
            var clicked_unpause = this.unPauseButton.getBounds()
                .contains(this.game.input.x, this.game.input.y)

            if (clicked_unpause) {
                this.game.paused = false;
            }
            this.unPauseButton.destroy();
        }
    }

    teleport (playerish, portal) {
        let lower, upper, tween, next_portal, next;
        lower = portal.x + portal.width/2 - portal.width * 0.1;
        upper = portal.x + portal.width/2 + portal.width * 0.1;

        if (lower <= playerish.x && playerish.x <= upper){
            if (!playerish.isTeleporting) {
                playerish.isTeleporting = true;
                playerish.can_move = false;
                tween = this.game.add.tween(playerish).to(
                        { alpha: 0 },
                        300, "Linear", true);

                tween.onComplete.add(()=>{
                    next = portal.z+1;
                    if (next == -1) {
                        next = 0
                    }
                    next_portal = this.portals.getAt(next)
                    playerish.x = next_portal.x + 20;
                    playerish.y = next_portal.top;
                    playerish.isTeleporting = false;
                    playerish.can_move = true;
                    tween = this.game.add.tween(playerish).to(
                            { alpha: 1 },
                            300, "Linear", true);
                }, this);
            }
        }

    }

}

class WinText extends Phaser.Text {

    constructor(stage) {
        let text, x, y, style, game;
        text = `Level ${stage.level} complete!`;
        x = stage.game.width/2;
        y = stage.game.height/2;
        style = stage.game.headerStyle;
        game = stage.game;
        super(game, x, y, text, style);
        this.visible = false;
        this.anchor.set(0.5);
    }
}

export {
    Game,
    WinText
}
