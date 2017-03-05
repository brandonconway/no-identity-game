import {Main} from "./Main.js"


class LevelMenu extends Phaser.State {

	init (level) {
		this.level = level || 1;
	}

	preload () {
		let filepath, basepath;
		basepath = "data";
		filepath = `${basepath}/level${this.level}.json`;
		this.game.load.json(`level${this.level}`, filepath);
	}

	create () {
        let text, playButton, instructions, images;

        this.game.addFullScreenButton();
		this.levelData = this.game.cache.getJSON(`level${this.level}`);

        text = this.add.text(this.game.width/2,
                             this.game.height/4,
							 `Start ${this.levelData.level.title}`,
                             this.game.headerStyle
                            ).anchor.set(0.5);

		instructions = this.levelData.level.instructions;
		images = instructions.images;

		images.forEach(
			(image_data) => {
				var image = this.add.image(
								image_data.position.x,
								image_data.position.y,
								image_data.key);
				image.anchor.set(0.5);
				image.scale.setTo(image_data.scale, image_data.scale);
			}
		)

        text = this.add.text(this.game.width/2,
                             this.game.height/4+100,
                             instructions.text,
                             this.game.textStyle
                            ).anchor.set(0.5);
        playButton = this.add.button(
             this.game.width/2,
             text.y+300, 'playButton',
             this.startGame, this
		);
		playButton.anchor.set(0.5);
		playButton.scale.setTo(2, 2);

        this.state.add('Main', Main);
	}

	startGame (level) {
		this.state.start('Main', true, false, this.level);
	}

};

export { LevelMenu };
