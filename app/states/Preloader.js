import {MainMenu} from "./MainMenu.js"
import {Main} from "./Main.js"


class Preloader extends Phaser.State  {

  	preload() {
        this.preloadBar = this.add.sprite(this.game.width/2-100,
            this.game.height/2, 'preloaderBar');
        this.preloadBar.scale.setTo(2);

	    this.text = this.add.text(this.game.width/2, this.game.height/2-100,
            "Loading...", this.game.headerStyle);
        this.text.anchor.setTo(0.5);
	    this.load.setPreloadSprite(this.preloadBar);

        // Buttons, etc
        this.load.image('playButton', 'assets/images/start_button.png');
        this.load.image('pauseButton', 'assets/images/pause_button.png');
        this.load.image('fullScreenButton', 'assets/images/fullscreen_button.png');
        this.load.image('reloadButton', 'assets/images/reload_button.png');
        this.load.image('shootButton', 'assets/images/shoot_button.png');
        this.load.image('noIdentity', 'assets/images/no_identity.jpg');
        // Game objects
        this.load.image('player', 'assets/images/blues_player2.png');
        this.load.image('glow', 'assets/images/glow.png');
        this.load.image('house', 'assets/images/house.png');
        this.load.image('portal', 'assets/images/portal.png');
        this.load.image('ground', 'assets/images/rect.png');
        this.load.image('boar', 'assets/images/boar.png');
        this.load.image('blast', 'assets/images/ringblast.png');
        // Handwriting text
        this.load.image('identity', 'assets/images/identity.png');
        this.load.image('start', 'assets/images/start.png');
        this.load.image('youLose', 'assets/images/you_lose.png');
        this.load.image('level_1_text', 'assets/images/level_1_text.png');
        this.load.image('level_2_text', 'assets/images/level_2_text.png');
        this.load.image('level_3_text', 'assets/images/level_3_text.png');
        this.load.image('level_4_text', 'assets/images/level_4_text.png');
        this.load.image('level_5_text', 'assets/images/level_5_text.png');
        this.load.image('level_6_text', 'assets/images/level_6_text.png');
        this.load.image('level_7_text', 'assets/images/level_7_text.png');
        this.load.image('level_8_text', 'assets/images/level_8_text.png');
        this.load.image('level_9_text', 'assets/images/level_9_text.png');
        this.load.image('level_10_text', 'assets/images/level_10_text.png');

        // Audio
        this.load.audio('mainMusic', ['assets/audio/main.m4a']);
        this.load.audio('machine', ['assets/audio/machine.m4a']);
        this.load.audio('goalMusic', ['assets/audio/goal.m4a']);
        this.load.audio('playerOuchSound', ['assets/audio/new_ouch_sound.m4a']);
        this.load.audio('boarOuchSound', ['assets/audio/boar_ouch.m4a']);
        this.load.audio('blastSound', ['assets/audio/blast2.m4a']);
        this.load.audio('jumpSound', ['assets/audio/jump_sound.m4a']);
        this.load.audio('teleportSound', ['assets/audio/teleport.m4a']);
    }

    create() {
		this.preloadBar.cropEnabled = false;
	}

    update() {
        this.state.add("MainMenu", MainMenu);
        this.state.start('MainMenu');
    }

}

export { Preloader }
