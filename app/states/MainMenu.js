import {HowToPlay} from "./HowToPlay.js"



class MainMenu extends Phaser.State {

    init () {
        this.game.addFullScreenButton();
        this.game.stage.backgroundColor = '#131313';
    }

    create() {
        this.startMusic = this.add.audio('machine');
        this.startMusic.loop = true;
        this.startMusic.play();
        let image, style, text, playButton, tween, tween2, duration;

        image = this.add.image(this.game.width/2, 0, 'noIdentity');
        image.scale.setTo(0.5);
        image.anchor.x = 0.5;
        image.alpha = 0;

        duration = 2000;
        //duration = 20;
        tween = this.add.tween(image).to(
            { alpha: 1 }, duration, Phaser.Easing.Exponential.In, true);
        tween2 = this.add.tween(image).to(
            { alpha: 0 }, duration, Phaser.Easing.Exponential.Out, false, duration);
        tween.onComplete.add(()=>{
            tween2.start();
        });

        playButton = this.add.button(
             this.game.width/2,
             image.y+300, 'playButton',
             this.startGame, this
         );
        playButton.anchor.set(0.5);
        playButton.scale.setTo(0.5, 0.5);
        playButton.alpha = 0;

        image = this.add.image(this.game.width/2, this.game.height/2-50, 'start');
        image.scale.setTo(0.5);
        image.anchor.x = 0.5;
        image.alpha = 0;
        image.inputEnabled = true;
        image.events.onInputDown.add(this.startGame, this);

        duration = 800;
        //duration = 20;
        tween2.onComplete.add(()=>{
            this.add.tween(playButton).to(
                { alpha: 1 }, duration, "Linear", true);
            this.add.tween(image).to(
                    { alpha: 1 }, duration, "Linear", true);
        });

        this.state.add("HowToPlay", HowToPlay);
    }

    startGame(pointer) {
	    this.state.start('HowToPlay', true, false, this.startMusic);
	}
};

export { MainMenu };
