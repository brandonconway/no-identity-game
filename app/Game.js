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

    winLevel (player, goal) {
        // Necessary logic when passing a level.
        // returns: a phaser game state
        if (!this.complete) {
            this.complete = true;
            this.game.win_text.visible = true; // use WinText method
            this.player.visible = false;
            this.game.groupers.visible = false;
            this.mainMusic.stop();
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
