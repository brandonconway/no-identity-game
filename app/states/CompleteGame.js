import {MainMenu} from "./MainMenu.js"


class CompleteGame extends Phaser.State {

	create () {
        let text, length;
		length = 4000;

        this.game.addFullScreenButton();
        text = this.add.text(this.game.width/2,
                             this.game.height/4,
							 `You win. You are what you are.`,
                             this.game.headerStyle
                            ).anchor.set(0.5);
        this.state.add('MainMenu', MainMenu);
		this.timer = setTimeout(()=>{
				this.startGame();
		}, length);
	}

	startGame (level) {
		clearTimeout(this.timer);
		this.state.start('MainMenu');
	}

};

export { CompleteGame };
