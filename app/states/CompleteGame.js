import {MainMenu} from "./MainMenu.js"


class CompleteGame extends Phaser.State {

	init (level) {
	}

	preload () {
	}

	create () {
        let text;

        this.game.addFullScreenButton();
        text = this.add.text(this.game.width/2,
                             this.game.height/4,
							 `You win. You are what you are.`,
                             this.game.headerStyle
                            ).anchor.set(0.5);
        this.state.add('MainMenu', MainMenu);
		this.timer = setTimeout(()=>{
				this.startGame();
		}, 3000);
	}

	startGame (level) {
		clearTimeout(this.timer);
		this.state.start('MainMenu');
	}

};

export { CompleteGame };
