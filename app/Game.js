import {MainMenu} from "./states/MainMenu.js"
import {Main} from "./states/Main.js"
import {IdentityPlayer} from "./components/Player.js"

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
                    this.state.start('MainMenu'); // Call completeGame state instead
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

    restartLevel (level, state) {
        // tween?
        // flash Message
        let text;
        text = this.add.text(400, 40, 'you lose', this.textStyle);
        state.player.kill();
        if (this.followers) {
            this.followers.visible = false;
            this.followers = null;
        }
        setTimeout(() => {
            this.state.start('Main', true, false, level);
            text.destroy();
        }, 1000);
    }

    reloadLevel (level) {
        setTimeout(() => {
            this.state.start('Main', true, false, level);
        }, 50);
    }

    addTouch(game, level) {
        let cursors, rightButton, leftButton,
            jumpButton, shootButton;

        this.levelData = game.cache.getJSON(`level${level}`);
        cursors = game.cursors;

        if (game.device.touch) {

            if( window.innerWidth < 1024) {

                game.input.onDown.add(onDownMobile,
                    {'cursors': cursors}
                );
                game.input.onUp.add(onUp, {'cursors': cursors});
                game.player.events.onInputDown.add(startJump);
            }
            else if (!game.device.desktop){

                leftButton = this.add.sprite(
                    game.width-100, game.height-50, 'playButton');
                leftButton.inputEnabled = true;
                leftButton.scale.setTo(2,3);
                leftButton.scale.x *= -1;
                leftButton.events.onInputDown.add(onDownButton,
                    {'direction': 'left',
                    'cursors': cursors}
                );
                leftButton.events.onInputUp.add(onUp, {'cursors': cursors});

                rightButton = this.add.sprite(
                    game.width-50, game.height-50, 'playButton');
                rightButton.inputEnabled = true;
                rightButton.scale.setTo(2,3);
                rightButton.events.onInputDown.add(onDownButton,
                    {'direction': 'right',
                    'cursors': cursors}
                );
                rightButton.events.onInputUp.add(onUp, {'cursors': cursors});


                jumpButton = this.add.sprite(
                    50, game.height-10, 'playButton');
                jumpButton.inputEnabled = true;
                jumpButton.scale.setTo(2,2);
                jumpButton.anchor.y = 1;
                jumpButton.angle = -90;
                jumpButton.events.onInputDown.add(onDownButton,
                    {'direction': 'jump'}
                );
                jumpButton.events.onInputUp.add(stopJump);

                shootButton = this.add.sprite(
                    70, game.height-10, 'shootButton');
                shootButton.inputEnabled = true;
                shootButton.scale.setTo(0.5);
                shootButton.anchor.y = 1;
                shootButton.events.onInputDown.add(onDownButton,
                    {'direction': 'shoot'}
                );
                shootButton.events.onInputUp.add(stopShoot);

            }

            // callbacks
            function onDownMobile(pointer) {
                if (pointer.clientX > game.width/2 && pointer.clientY < game.height/2) {
                    this.cursors.right.isDown = true;
                }
                else if (pointer.clientX < game.width/2 && pointer.clientY < game.height/2){
                    this.cursors.left.isDown = true;
                }
                if (pointer.clientY > game.height/2) {
                    startJump();
                }
            }

            function onDownButton (){
                if (this.direction == 'left'){
                    this.cursors.left.isDown = true;
                }
                if (this.direction == 'right'){
                    this.cursors.right.isDown = true;
                }

                if (this.direction == 'jump'){
                    game.player.jumpButton.isDown = true;
                }
                if (this.direction == 'shoot'){
                    game.player.shootButton.isDown = true;
                }
            }

            function onUp (){
                this.cursors.left.isDown = false;
                this.cursors.right.isDown = false;
                game.player.jumpButton.isDown = false;
            }

            function startJump (){
                game.player.jumpButton.isDown = true;
            }
            function stopJump (){
                game.player.jumpButton.isDown = false;
            }

            function stopShoot(){
                game.player.shootButton.isDown = false;
                game.player.shootButton.isUp = true;
            }

        } //end if touch
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

    addReloadButton (level) {
        let x;
        if (!this.device.touch) {
            x = this.width-60
        }
        else {
            x = this.width - 35;
        }
        this.reloadButton = this.add.button(x, 5,
             'reloadButton',
             () => {
                 this.reloadLevel(level)
             }
        );
        this.reloadButton.scale.set(0.5);
    }

    addFullScreenButton () {
        let game;
        game = this;
        if (!game.device.touch) {
            if(!this.scale.isFullScreen) {
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
        // replace with big play button and "Paused text"
        if (this.game.paused) {
            var clicked_unpause = this.unPauseButton.getBounds()
                .contains(this.game.input.x, this.game.input.y)

            if (clicked_unpause) {
                this.game.paused = false;
                this.unPauseButton.destroy();
            }
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
                if(!this.game.teleportSound.isPlaying){
                   this.game.teleportSound.play();
                }
                tween.onComplete.add(()=>{
                    next = portal.z+1;
                    if (next == -1) {
                        next = 0
                    }
                    next_portal = this.portals.getAt(next)
                    playerish.x = next_portal.x + 20;
                    if (playerish instanceof IdentityPlayer) {
                        playerish.y = next_portal.y + playerish.height;
                    }
                    else {
                        playerish.y = next_portal.y;
                    }
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
        y = stage.game.height/2 - 100;
        style = stage.game.headerStyle;
        game = stage.game;
        super(game, x, y, text, style);
        this.visible = false;
        this.anchor.set(0.5);
        this.setShadow(2, 2, 'rgba(0,0,0,1)', 0);
    }
}

export {
    Game,
    WinText
}
