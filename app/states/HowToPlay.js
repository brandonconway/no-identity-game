import {LevelMenu} from "./LevelMenu.js";


class HowToPlay extends Phaser.State {

    create () {
        this.game.addFullScreenButton();

        var text, playButton;
        text = this.add.text(this.game.width/2,
                             this.game.height/4,
                             "How to play",
                             this.game.headerStyle
                            ).anchor.set(0.5);
        playButton = this.add.button(
                                     this.game.width/2,
                                     text.y+300, 'playButton',
                                     this.startGame, this
                                    );
        playButton.scale.setTo(2, 2);
        playButton.anchor.set(0.5);

        var image = this.add.image(this.game.width/2-170,
                                   this.game.height/4+100,
                                   'player');
        image.anchor.set(0.5);
        image.scale.setTo(0.6, 0.6);

        text = this.add.text(this.game.width/2,
                             this.game.height/4+100,
                             "Guide all of your associates home",
                             this.game.textStyle
                            ).anchor.set(0.5);
        image = this.add.image(this.game.width-220,
                               this.game.height/4+100,
                               'house');
        image.anchor.set(0.5);
        this.state.add('LevelMenu', LevelMenu);

	}

	startGame (level) {
		this.state.start('LevelMenu', true, false, 1);
	}


};

export { HowToPlay };
