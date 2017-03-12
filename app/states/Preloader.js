import {MainMenu} from "./MainMenu.js"
import {Main} from "./Main.js"


class Preloader extends Phaser.State  {

  	preload() {

        this.load.image('playButton', 'assets/images/play_button.png');
        this.load.image('pauseButton', 'assets/images/pause_button.png');
        this.load.image('fullScreenButton', 'assets/images/fullscreen_button.png');
        this.load.image('player', 'assets/images/identifier.png');
        this.load.image('house', 'assets/images/house.png');
        this.load.image('portal', 'assets/images/portal.png');
        this.load.image('ground', 'assets/images/rect.png');
        this.load.audio('mainMusic', ['assets/audio/main.m4a']);
        this.load.audio('goalMusic', ['assets/audio/goal.mp3']);

    	//this.background = this.add.sprite(0, 0, 'preloaderBackground');
	    this.preloadBar = this.add.sprite(100, 100, 'preloaderBar');
	    this.text = this.add.text(100, 100, "Loading...", this.headerStyle);
	    this.load.setPreloadSprite(this.preloadBar);
    }

    create() {
		this.preloadBar.cropEnabled = false;
	}

    update() {
        this.state.add("MainMenu", MainMenu);
        this.state.start('MainMenu');
        //this.state.add("Main", Main);
        //this.state.start('Main');
    }

}

export { Preloader }
