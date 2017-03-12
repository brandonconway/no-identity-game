import {IdentityPlayer} from "../components/Player.js"
import {Goal} from "../components/Goal.js"
import {WinText} from "../Game.js"

class Main extends Phaser.State {

    init (level) {
        /*
        * TODO:
        * Move game-level attributes to the Game module
        * Move reusable creation routines into either the Game module
        * or into separate, relevant components
        */
        this.game.addFullScreenButton();
        this.game.add.button(this.width-20, 0,
                             'pauseButton',
                             this.game.pauseGame, this
                            );
        this.game.gravity = 1500; // will this change per stage?
        this.level = level;
        this.complete = false;
        this.backgroundColor = 'black'; // will this change per stage?
        this.levelData = this.game.cache.getJSON(`level${this.level}`);
        this.game.addIdentityBar(this.levelData.level.identity_level);
        this.teleportHeight = 0;
    }

    create() {
        let x, y, win_text,
            ground, ledge,
            options, levelPlatforms,
            goal_position, buffer;

        // Basics
        this.game.stage.backgroundColor = this.backgroundColor;
        this.game.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.addTouch(this.game);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Text
        win_text = new WinText(this);
        this.game.add.existing(win_text);
        this.game.win_text = win_text;

        // Platforms
        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;
        levelPlatforms = this.levelData.level.platforms;
        levelPlatforms.forEach((platform)=> {
            let platformChild;
            x = platform.xOffset;
            y = this.game.height - platform.yOffset;
            platformChild = this.platforms.create(x, y, platform.key);
            platformChild.scale.setTo(platform.scaleX, platform.scaleY);
            platformChild.body.immovable = true;
        });

        // Portals
        if (this.levelData.level.portals) {
            let portals, child, portal_circle, portal_sprite;
            portals = this.levelData.level.portals;
            this.portals = this.game.add.group();
            this.portals.enableBody = true;
            portals.forEach((portal)=>{
                child = this.portals.create(portal.x, portal.y, "portal")
                child.body.immovable = true;
                child.scale.set(0.25, 0.25);
                child.anchor.set(0, 0);
            });
            this.game.physics.enable(this.portals, Phaser.Physics.ARCADE);

        }

        // Followers
        if (this.levelData.level.followers) {
            this.game.followers = this.game.add.group();
            this.game.followers.enableBody = true;
            for (var i = 0; i < this.levelData.level.followers.number; i++)
            {
                let follower;
                x = 0 - (40 + i);
                y = 0;
                follower = this.game.followers.create(x, y, 'player');
                follower.enableBody = true;
                follower.body.gravity.y = this.game.gravity;
                follower.body.bounce.y = 0.2
                follower.body.collideWorldBounds = true;
                follower.isTeleporting = false;
                follower.anchor.setTo(0.5, 0);
            }
            this.game.physics.enable(this.game.followers, Phaser.Physics.ARCADE);
        }

        // Player
        x = 5;
        y = 0;
        options = this.levelData.level.player;
        this.player = new IdentityPlayer(this.game, x, y, 'player', options);
        this.game.add.existing(this.player);

        // Goal (house)
        goal_position = this.levelData.level.goal;
        this.house = new Goal(this.game, 0, 0, 'house');
        this.house.x = goal_position.xOffset;
        this.house.y = goal_position.yOffset;
        this.game.add.existing(this.house);

        // Music
        this.mainMusic = this.add.audio('mainMusic');
        if(!this.mainMusic.isPlaying){
            this.mainMusic.loop = true;
            this.mainMusic.play();
        }
        this.goalMusic = this.add.audio('goalMusic');

        // Dev keyboard cheats
        this.levelButton1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        this.levelButton2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        this.levelButton3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        this.levelButton4 = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        this.levelButton5 = this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    }

    update () {

        this.player.body.velocity.x = 0;
        this.game.physics.arcade.collide(this.player, this.platforms);

        if (this.portals) {
            this.game.physics.arcade.overlap(
                this.player,
                this.portals,
                this.teleport,
                null, this
            );
            this.game.physics.arcade.overlap(
                this.game.followers,
                this.portals,
                this.teleport,
                null, this
            );
        }

        if (this.game.followers) {
            this.game.physics.arcade.collide(this.game.followers, this.platforms);
            // followers should follow player
            this.game.followers.children.forEach((person, index) => {
               var next_person = index +1;
                if (next_person > this.game.followers.length-1) {
                    next_person = this.player;
                }
                else {
                    next_person = this.game.followers.getAt(next_person);
                }
                /*
                person.tween = this.game.add.tween(person).to(
                        { x: next_person.x },
                        100+(index*10),
                        "Linear", false);
                person.tween.stop();*/

                if (!person.body.touching.down)  {
                    person.let_bounce = true;
                    //person.tween.stop();
                    if (this.player.can_jump) {
                        person.body.velocity.x = -10 * this.player.scale.x;
                    }
                }
                else if (person.body.touching.down) {


                    if (this.player.is_jumping) {
                        person.body.velocity.y -= 400;
                    }
                    else if (person.let_bounce) {
                        person.let_bounce = false;
                    }
                    else {
                        //person.tween.start();
                        this.game.physics.arcade.moveToObject(
                            person, this.player, 60+(index*15));
                    }
                }
            });
            // level ends when slowest follower collides with goal
            this.game.physics.arcade.collide(this.player,
                this.house,
                (player, house) => {
                    player.visible = false;
                    player.body.x +=5; // make sure the followers collide w/ goal
                    this.goalMusic.play();
                },
                null, this);


            // first follower is slowest.
            let slowest_follower = this.game.followers.children[0];
            this.game.physics.arcade.collide(
                slowest_follower,
                this.house,
                this.game.winLevel,
                null, this);

            this.game.physics.arcade.collide(
                this.game.followers,
                this.house,
                (house, follower) => {
                    follower.kill();
                    this.goalMusic.play();
                },
                null, this);

        }
        else {
            this.game.physics.arcade.collide(
                this.player,
                this.house,
                this.game.winLevel, null, this);
        }

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

    shutdown () {
        this.game.followers = null;
        this.player.destroy();
    }

    teleport (playerish, portal) {
        let lower, upper, tween, next_portal, next;
        lower = portal.x + portal.width/2 - portal.width * 0.1;
        upper = portal.x + portal.width/2 + portal.width * 0.1;

        if (lower <= playerish.x && playerish.x <= upper){
            console.log('fff')
            if (!playerish.isTeleporting) {
                playerish.isTeleporting = true;
                playerish.can_move = false;
                tween = this.game.add.tween(playerish).to(
                        { alpha: 0 },
                        300, "Linear", true);

                tween.onComplete.add(()=>{
                    next = portal.z+1;
                    console.log(next)
                    if (next == -1) {
                        next = 0
                    }
                    next_portal = this.portals.getAt(next)
                    playerish.x = next_portal.x + 15;
                    playerish.y = next_portal.top;
                    playerish.isTeleporting = false;
                    playerish.can_move = true;
                    tween = this.game.add.tween(playerish).to(
                            { alpha: 1 },
                            300, "Linear", true);
                }, this);
            }

        }

    }

}

export { Main };
