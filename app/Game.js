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

    }

    getObjectsByTypeFromTileMap (file, object_type) {
        // args; tilemap file (path), objects to retrieve (string)
        // returns: list of objects
    }

    getPointsFromPointObjects (point_objects) {
        // args: point objects from tilemap
        // returns: an array of objects with x,y coords
    }

    generatePathFromPoints (points) {
        // args: points from tilemap objects and creates motion path
        // return: generated path

        //this.bmd.clear();
        var x = 1 / this.width;
        var path = [];

        for (var i = 0; i <= 1; i += x) {
            var px = this.math.catmullRomInterpolation(points.x, i);
            var py = this.math.catmullRomInterpolation(points.y, i);
            //this.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)'); draw a line on the path.
            path.push( { x: px, y: py });
        }
        return path;
    }

    loseGame () {
        // Necessary logic when the game is overa
        // returns: a phaser game state
    }

    winLevel (player, goal) {
        // Necessary logic when passing a level.
        // returns: a phaser game state
        this.game.win_text.visible = true;
        this.player.visible = false;
        this.groupers.visible = false;
        this.mainMusic.stop();
        setTimeout(()=>{this.state.start('MainMenu');}, 1500);
    }

    completeGame () {
        // Necessary logic when completing game.
        // returns: a phaser game state
    }

    addTouch(state) {
        var game = state.game;
        var cursors = state.cursors;

        if (game.device.touch) {
            var rightButton = this.add.sprite(
                                         game.width-40,
                                         game.height/2, 'playButton');
            rightButton.inputEnabled = true;
            rightButton.scale.setTo(2,2);
            rightButton.events.onInputDown.add(onDown,
                {'direction': 'right',
                'cursors': cursors});

            var leftButton = this.add.sprite(
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

export {
    Game
}
