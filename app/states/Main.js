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
        this.identity_level = this.levelData.level.identity_level;
        this.identity_bar = this.game.addIdentityBar(this.identity_level);
        this.teleportHeight = 0;
    }

    create() {
        let x, y, win_text,
            ground, ledge,
            options, levelPlatforms,
            goal_position, buffer,
            wizard_data;

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
        this.bouncers = this.game.add.group();
        this.bouncers.enableBody = true;
        this.platforms.enableBody = true;
        levelPlatforms = this.levelData.level.platforms;
        levelPlatforms.forEach((platform)=> {
            let platformChild;
            x = platform.xOffset;
            y = this.game.height - platform.yOffset;
            platformChild = this.platforms.create(x, y, platform.key);
            platformChild.scale.setTo(platform.scaleX, platform.scaleY);
            platformChild.body.immovable = true;
            // add bouncers (Invisible collide sprites)
            this.bouncers.create(platformChild.right, platformChild.top, null);
            this.bouncers.create(platformChild.left, platformChild.top, null);
        });
        this.bouncers.forEach((bouncer)=>{
            bouncer.anchor.setTo(0.5, 1);
            bouncer.enableBody = true;
            bouncer.body.immovable = true;
            bouncer.scale.setTo(0.5, 0.25);
        })

        // boars
        if (this.levelData.level.boars) {
            let boars, child;
            boars = this.levelData.level.boars;
            this.boars = this.game.add.group();
            this.boars.enableBody = true;
            boars.forEach((boar)=>{
                child = this.boars.create(boar.x, boar.y, "boar")
                child.scale.set(0.75, 0.75);
                child.anchor.set(0.5, 1);
                child.enableBody = true;
                child.body.velocity.x = -80;
                child.velocity = 80;
                child.body.bounce.x = 0.5;
            });
            this.game.physics.enable(this.boars, Phaser.Physics.ARCADE);
        }

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

        // Wizard
        if (this.levelData.level.wizard) {
            wizard_data = this.levelData.level.wizard;
            this.wizard = this.game.add.sprite(wizard_data.x, wizard_data.y, 'boar');
            this.wizard.scale.setTo(-1, 1);
            this.wizard.enableBody = true;
            this.game.physics.enable(this.wizard, Phaser.Physics.ARCADE);
            // wizard needs to do blasting and killing
            this.wizard_blasts = this.game.add.group();
            this.wizard_blasts.createMultiple(7, "ground", null, true);
            this.game.physics.enable(this.wizard_blasts, Phaser.Physics.ARCADE);
            this.wizard_blasts.children.forEach((blast, index)=>{
                blast.enableBody =true;
                blast.x = this.wizard.x-10;
                blast.y = this.wizard.y;
                blast.body.velocity.x = 325;
                blast.scale.setTo(0.5, 0.5);

                var r = Math.random() * 2 - 1;
                blast.body.gravity.y = 70 * r;
            });
            this.wizard_blasts.setAll('outOfBoundsKill', true);
        }
        // Music
        this.mainMusic = this.add.audio('mainMusic');
        if(!this.mainMusic.isPlaying){
            this.mainMusic.loop = true;
            this.mainMusic.play();
        }
        this.goalMusic = this.add.audio('goalMusic');
        this.ouchSound = this.add.audio('ouchSound');


        // Dev keyboard cheats
        this.levelButton1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        this.levelButton2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        this.levelButton3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        this.levelButton4 = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        this.levelButton5 = this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    }

    update () {
        this.game.physics.arcade.collide(this.player, this.platforms);

        // boars
        if (this.boars) {
            this.game.physics.arcade.collide(this.player, this.boars,
                this.boarCollide, null, this);
            this.game.physics.arcade.collide(this.boars, this.bouncers,
                this.bounceBack, null, this);
        }

        // Wizard
        if (this.wizard) {
            this.wizard_blasts.children.forEach((blast)=>{
                if (blast.body.x > this.game.width) {
                    blast.body.x = this.wizard.x-10;
                    blast.body.y = this.wizard.y;
                }
            });
            this.game.physics.arcade.collide(
                this.player,
                this.wizard_blasts,
                this.player.doDamage,
                null, this
            );
            this.game.physics.arcade.collide(
                this.game.followers,
                this.wizard_blasts,
                this.player.doDamage,
                null, this
            );
        }
        // Portals
        if (this.portals) {
            this.game.physics.arcade.overlap(
                this.player,
                this.portals,
                this.game.teleport,
                null, this
            );
            this.game.physics.arcade.overlap(
                this.game.followers,
                this.portals,
                this.game.teleport,
                null, this
            );
        }

        // Followers
        if (this.game.followers) {
            this.game.physics.arcade.collide(
                this.game.followers,
                this.platforms
            );
            // player follow logic
            this.game.followers.children.forEach((person, index) => {
                if (!person.body.touching.down)  {
                    person.let_bounce = true;
                    if (this.player.can_jump) {
                        if (person.x > this.player.x) {
                            person.body.velocity.x = -15 * 1;
                        }
                        else if (person.x < this.player.x){
                            person.body.velocity.x = -15 * -1;
                        }
                        else {
                            person.body.velocity.x = 0;
                        }
                    }
                }
                else if (person.body.touching.down) {
                    if (this.player.is_jumping) {
                        person.body.velocity.y -= 420;
                    }
                    else if (person.let_bounce) {
                        person.let_bounce = false;
                    }
                    else if (this.player.y > person.y){
                    //else{
                        this.game.physics.arcade.moveToObject(
                            person, this.player, 60+(index*10));
                    }
                }
            });

            // level ends when slowest follower collides with goal
            this.game.physics.arcade.collide(this.player,
                this.house,
                (player, house) => {
                    player.visible = false;
                    player.body.x += 5; // make sure all followers collide w/ goal
                    player.can_jump = false;
                    player.can_shoot = false;
                    if (!this.goalMusic.isPlaying) {
                        this.goalMusic.play();
                    }
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

        // blasts
        if (this.player.blast) {
            this.game.physics.arcade.collide(
                this.player.blast2,
                this.boars,
                this.killBoar, null, this);
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
        this.mainMusic.stop();
    }

    boarCollide (playerish, boar) {
        let tween, hit;
        tween = this.game.add.tween(playerish).to(
                { alpha: 0 },
                20, "Linear", true);
        tween.onComplete.add(()=>{
                this.game.add.tween(playerish).to(
                        { alpha: 1 },
                        20, "Linear", true);
                });

        this.identity_bar.bar.forEach((bar)=> {bar.destroy()})
        this.identity_bar.text.destroy();
        this.identity_level -= 1;
        if (this.identity_level <= 0) {
            this.game.restartLevel(this.level, this);
        }
        this.identity_bar = this.game.addIdentityBar(this.identity_level);
        // alpha tween? animation?
        this.ouchSound.play();
        this.bounceBack(boar, playerish);
        // hacky bounce back. not sure why collide isn't working right
        if (playerish.body.touching.right) {
            playerish.body.x -= 5;
        }
        else if (playerish.body.touching.left) {
            playerish.body.x += 5;
        }
    }

    bounceBack (boar, bouncer) {
        let flip = boar.scale.x;
        boar.scale.x = -1*flip;
        //this.animations.play('walk')
        boar.body.velocity.x = flip * boar.velocity;
    }

    killBoar (blast, boar) {
        // play sound, make animation
        let tween;
        tween = this.game.add.tween(boar).to(
                { alpha:  0},
                200, "Linear", true);
        tween.onComplete.add(()=>{
            boar.kill();
        })
    }
}

export { Main };
