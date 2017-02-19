import {Main} from "./Main.js"


class LevelMenu extends Phaser.State {

	init (level) {
		this.level = level || 1;
	}

	create() {
        this.game.addFullScreenButton();

        var text, playButton;
        text = this.add.text(this.game.width/2,
                             this.game.height/4, `Start Level ${this.level}`,
                             this.game.headerStyle
                            ).anchor.set(0.5);
        var playButton = this.add.button(
                                     this.game.width/2,
                                     text.y+300, 'playButton',
                                     this.startGame, this
								 );
		playButton.anchor.set(0.5);
		playButton.scale.setTo(2, 2);
        this.state.add('Main', Main);
	}

	startGame (level) {
		this.mainMusic = this.add.audio('mainMusic');
        this.mainMusic.loop = true;
        if(!this.mainMusic.isPlaying){
            this.mainMusic.play();
        }
		this.state.start('Main');
	}

};

export { LevelMenu };
