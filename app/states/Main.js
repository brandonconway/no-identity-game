import {IdentityPlayer} from "../components/Player.js"
import {Goal} from "../components/Goal.js"
import {WinText} from "../Game.js"

class Main extends Phaser.State {

    init (level) {
        this.game.addFullScreenButton();
        this.game.add.button(this.width-20, 0,
                             'pauseButton',
                             this.game.pauseGame, this
                            );
        this.game.gravity = 1000; // will this change per stage?
        this.level = level;
        this.complete = false;
        this.backgroundColor = 'black'; // will this change per stage?
        this.levelData = this.game.cache.getJSON(`level${this.level}`);
        this.game.addIdentityBar(this.levelData.level.identity_level);
    }

    create() {
        let x, y, win_text, ground, ledge, options, levelPlatforms;

        this.game.stage.backgroundColor = this.backgroundColor;
        this.game.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.addTouch(this.game);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        win_text = new WinText(this);
        this.game.add.existing(win_text);
        this.game.win_text = win_text;

        // Platforms
        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;
        levelPlatforms = this.levelData.level.platforms;
        levelPlatforms.forEach((platform)=> {
            let platformChild;
            console.log(platform);
            x = platform.xOffset;
            y = this.game.height - platform.yOffset;
            platformChild = this.platforms.create(x, y, platform.key);
            platformChild.scale.setTo(platform.scaleX, platform.scaleY);
            platformChild.body.immovable = true;
            console.log(platformChild);

        });

        // Group
        this.game.groupers = this.game.add.group();
        this.game.groupers.enableBody = true;
        for (var i = 0; i < 6; i++)
        {
            x = 0 - (40 + i);
            y = 0;
            this.game.groupers.create(x, y, 'player');
        }
        this.game.groupers.children.forEach((person, index)=>{
            person.body.gravity.y = this.game.gravity;
        });
        this.game.physics.enable(this.game.groupers, Phaser.Physics.ARCADE);

        // Player
        x = 5;
        y = 0;
        options = this.levelData.level.player;
        this.player = new IdentityPlayer(this.game, x, y, 'player', options);
        this.game.add.existing(this.player);

        // Goal (house)
        x = this.game.width * 0.97;
        y = this.game.world.height - 77;
        this.house = new Goal(this.game, x, y, 'house');
        this.game.add.existing(this.house);

        // Music
        this.mainMusic = this.add.audio('mainMusic');
        this.mainMusic.loop = true;
        this.mainMusic.stop();
        if(!this.mainMusic.isPlaying){
            this.mainMusic.play();
        }

        //dev keyboard cheats
        this.levelButton1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        this.levelButton2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        this.levelButton3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        this.levelButton4 = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        this.levelButton5 = this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    }

    update () {
        this.player.body.velocity.x = 0;
        this.game.physics.arcade.collide(this.player, this.platforms);

        this.game.physics.arcade.collide(this.game.groupers, this.platforms);

        // first grouper is slowest.
        let slowest_grouper = this.game.groupers.children[0];
        slowest_grouper = this.game.groupers.getFirstExists();
        this.game.physics.arcade.collide(slowest_grouper, this.house, this.game.winLevel, null, this);

        /* make characters disappear when collide with house?
        this.game.physics.arcade.collide(this.player,
                                         this.house,
                                         (player, house) => { player.kill();},
                                         null, this);
        this.game.physics.arcade.collide(this.game.groupers,
                                         this.house,
                                         (house, grouper) => { grouper.kill();},
                                         null, this);
        */


        //dev cheats
        if (this.levelButton1.isDown) {
            this.state.start('LevelMenu', true, false, 1);
        }
        if (this.levelButton2.isDown) {
            this.state.start('LevelMenu', true, false, 2);
        }
        if (this.levelButton3.isDown) {
            this.state.start('LevelMenu', true, false, 3);
        }
        if (this.levelButton4.isDown) {
            this.state.start('LevelMenu', true, false, 4);
        }
        if (this.levelButton5.isDown) {
            this.state.start('LevelMenu', true, false, 5);
        }

    }

}

export { Main };
