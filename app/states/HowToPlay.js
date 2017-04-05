import {LevelMenu} from "./LevelMenu.js";


class HowToPlay extends Phaser.State {

    init (music) {
        this.music = music;
    }

    create () {
        this.game.addFullScreenButton();
        var text, playButton, controlsImages;
        text = this.add.text(this.game.width/2,
                             this.game.height/4,
                             "How to play",
                             this.game.headerStyle
                            ).anchor.set(0.5);
        playButton = this.add.button(
            this.game.width/2, text.y+300, 'playButton', this.startGame, this);
        playButton.scale.setTo(0.5);
        playButton.anchor.set(0.5);

        text = this.add.text(this.game.width/2,
            this.game.height/4+100,
            "Complete each level to discover your identity",
             this.game.textStyle
        ).anchor.set(0.5);

        // How to play instructions
        /*
        if (this.game.device.touch) {
            if size is smaller than tablet {
             show how to play phone controls
            }
            else if not desktop
            // you are tablet
            {
                show tablet how to play
            }
        }
        else {
            // you are desktop/laptop hopefulley
            show how to play desktop (keyboard)

        }
    }
        */

        this.state.add('LevelMenu', LevelMenu);

	}

	startGame (level) {
        this.music.stop();
		this.state.start('LevelMenu', true, false, 1);
	}

};

export { HowToPlay };
