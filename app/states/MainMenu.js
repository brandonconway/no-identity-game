import {HowToPlay} from "./HowToPlay.js"



class MainMenu extends Phaser.State {

    init () {
        this.game.addFullScreenButton();
    }

    create() {

        var style, text, playButton;
        text = this.add.text(this.game.width/2,
                             this.game.height/4,
                             "No Identity",
                             this.game.headerStyle
                            ).anchor.set(0.5);

        var playButton = this.add.button(
                                     this.game.width/2,
                                     text.y+300, 'playButton',
                                     this.startGame, this
                                 );
        playButton.anchor.set(0.5);
        playButton.scale.setTo(2, 2);

        this.state.add("HowToPlay", HowToPlay);
    }

    startGame(pointer) {
	    this.state.start('HowToPlay');
	}
};

export { MainMenu };
