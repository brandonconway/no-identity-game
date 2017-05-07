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

		text = this.add.image(this.game.width/2,
                             this.game.height/4,
							 `level_${this.level}_text`,
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
		playButton.scale.setTo(0.5);

        this.state.add('Main', Main);

		this.timer = setTimeout(()=>{
				this.startGame();
		}, 3000);
	}

	startGame (level) {
		clearTimeout(this.timer);
		//amazing iOS audio hack (add and start each audio track you need)
		this.startMusic = this.add.audio('mainMusic');
		this.startMusic.volume = 0;
        this.startMusic.play();
        this.startMusic.stop();
		this.startMusic = this.add.audio('goalMusic');
		this.startMusic.volume = 0;
        this.startMusic.play();
        this.startMusic.stop();
		this.startMusic = this.add.audio('playerOuchSound');
		this.startMusic.volume = 0;
        this.startMusic.play();
        this.startMusic.stop();
		this.startMusic = this.add.audio('boarOuchSound');
		this.startMusic.volume = 0;
        this.startMusic.play();
        this.startMusic.stop();
		this.startMusic = this.add.audio('jumpSound');
		this.startMusic.volume = 0;
        this.startMusic.play();
        this.startMusic.stop();
		this.startMusic = this.add.audio('blastSound');
		this.startMusic.volume = 0;
        this.startMusic.play();
        this.startMusic.stop();
		this.startMusic = this.add.audio('teleportSound');
		this.startMusic.volume = 0;
        this.startMusic.play();
        this.startMusic.stop();


		this.state.start('Main', true, false, this.level);
	}

};

export { LevelMenu };
