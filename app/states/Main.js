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
        this.pauseButton = this.game.add.button(0, 0,
                             'pauseButton',
                             this.game.pauseGame, this
                         );
        this.pauseButton.scale.setTo(0.5);
        this.game.gravity = 1500; // will this change per stage?
        this.level = level;
        this.complete = false;
        this.backgroundColor = '#131313'; // will this change per stage?
        this.levelData = this.game.cache.getJSON(`level${this.level}`);
        this.identity_level = this.levelData.level.identity_level;
        this.identity_bar = this.game.addIdentityBar(this.identity_level);
        this.reloadButton = this.game.addReloadButton(this.level);
        this.player_start = this.levelData.level.player.x;
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
        this.game.physics.startSystem(Phaser.Physics.ARCADE);



        // Platforms
        // TODO: each of these sections could be moved to a component module
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

        // Portals TODO: refactor to module
        if (this.levelData.level.portals) {
            let portals, child, silent;
            portals = this.levelData.level.portals;
            this.portals = this.game.add.group();
            this.portals.enableBody = true;
            this.silent_portals = this.game.add.group();
            this.silent_portals.enableBody = true;

            portals.forEach((portal)=>{
                child = this.portals.create(portal.x, portal.y, "portal")
                child.enableBody = true;
                child.body.immovable = true;
                child.scale.set(0.25, 0.25);
                child.anchor.set(0, 0);
                // make invisble portals to block hitting from underneath.
                silent = this.silent_portals.create(portal.x, portal.y+5, "portal")
                silent.visible = false;
                silent.enableBody = true;
                silent.body.immovable = true;
                silent.scale.set(0.27, 0.27);
                silent.anchor.set(0, 0);
            });

            this.game.physics.enable(this.portals, Phaser.Physics.ARCADE);
            this.game.physics.enable(this.silent_portals, Phaser.Physics.ARCADE);
        }


        // Followers TODO: refactor to module
        if (this.levelData.level.followers) {
            this.game.followers = this.game.add.group();
            this.game.followers.enableBody = true;
            for (var i = 0; i < this.levelData.level.followers.number; i++)
            {
                let follower;
                x = this.player_start - (20 + i);
                y = 0;
                follower = this.game.followers.create(x, y, 'player');
                follower.enableBody = true;
                follower.body.gravity.y = this.game.gravity;
                follower.body.bounce.y = 0.2
                follower.scale.setTo(0.55);
                follower.body.collideWorldBounds = true;
                follower.isTeleporting = false;
                follower.anchor.setTo(0.7, 0);
            }
            this.game.physics.enable(this.game.followers, Phaser.Physics.ARCADE);
        }

        // Player
        x = this.player_start;
        y = 0;
        options = this.levelData.level.player;
        this.player = new IdentityPlayer(this.game, x, y, 'player', options);
        this.game.add.existing(this.player);
        this.game.player = this.player;

        // Goal (house)
        goal_position = this.levelData.level.goal;
        this.house = new Goal(this.game,
            goal_position.xOffset, goal_position.yOffset, 'house');
        if (goal_position.scale) {
            this.house.scale.x *= goal_position.scale;
        }
        this.game.add.existing(this.house);

        // Wizard TODO: refactor to module
        if (this.levelData.level.wizard) {
            wizard_data = this.levelData.level.wizard;
            this.wizard = this.game.add.sprite(wizard_data.x+30, wizard_data.y, 'boar');
            this.wizard.scale.setTo(-1, 1);
            this.wizard.health = 5;
            this.game.physics.enable(this.wizard, Phaser.Physics.ARCADE);
            this.wizard.enableBody = true;
            // wizard needs to do blasting and killing
            this.create_wizard_blasts = (blasts) => {
                this.wizard_blasts = blasts || this.game.add.group();
                this.wizard_blasts.createMultiple(3, "ground", null, true);
                this.game.physics.enable(this.wizard_blasts, Phaser.Physics.ARCADE);

                this.wizard_blasts.children.forEach((blast, index)=>{
                    blast.enableBody =true;
                    blast.x = this.wizard.x-10;
                    blast.y = this.wizard.y;
                    blast.body.velocity.x = 300;
                    blast.scale.setTo(0.5, 0.5);
                    let r = Math.random() * 2 - 1;
                    blast.body.gravity.y = 200 * r;
                    });
                this.wizard_blasts.setAll('outOfBoundsKill', true);
            }
            this.create_wizard_blasts();
            // shoot wizard by tapping on phones
            if (this.game.device.touch && this.wizard && this.player.can_shoot) {
                    this.wizard.inputEnabled = true;
                    this.wizard.events.onInputDown.add(this.player.fireBlast, this.player);
            }
        }

        // shoot boars by tapping on phones
        if (this.game.device.touch && this.boars && this.player.can_shoot) {
            this.boars.children.forEach((child)=>{
                child.inputEnabled = true;
                child.events.onInputDown.add(this.player.fireBlast, this.player);
            });
        }
        // Music and sounds
        this.goalMusic = this.add.audio('goalMusic');
        this.goalMusic.volume = 0.8;
        this.ouchSound = this.add.audio('ouchSound');
        this.mainMusic = this.add.audio('mainMusic');
        this.mainMusic.stop();

        if(!this.mainMusic.isPlaying){
            this.mainMusic.loop = true;
            this.mainMusic.play();
        }
        this.game.teleportSound = this.game.add.audio("teleportSound");
        this.playerOuchSound = this.game.add.audio("playerOuchSound");
        this.boarOuchSound = this.game.add.audio("boarOuchSound");
        this.game.teleportSound.volume = 1;
        this.playerOuchSound.volume =  0.8;
        this.boarOuchSound.volume = 1;

        // Text
        win_text = new WinText(this);
        this.game.add.existing(win_text);
        this.game.win_text = win_text;

        // Dev keyboard cheats
        this.levelButton1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        this.levelButton2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        this.levelButton3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        this.levelButton4 = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        this.levelButton5 = this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
        this.game.addTouch(this.game, this.level);

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
            this.game.physics.arcade.collide(this.wizard, this.bouncers,
                this.bounceBack, null, this);
            this.game.physics.arcade.collide(this.player, this.wizard,
                    this.player.doDamage, null, this);

            this.wizard_blasts.children.forEach((blast)=>{
                if (blast.body.x > this.game.width) {
                    blast.body.x = this.wizard.x-10;
                    blast.body.y = this.wizard.y;
                }
                // instead use get alive?
                if (this.wizard_blasts.getFirstAlive() === null) {
                    // rebuild blasts or charge?
                    // rebuild blasts is pretty difficult
                    //this.create_wizard_blasts(this.wizard_blasts);
                    this.wizard.body.velocity.x = 75;
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
            this.game.physics.arcade.collide(
                this.player.blast,
                this.wizard_blasts,
                (wblast, pblast) => {
                    wblast.kill();
                },
                null, this
            );
            this.game.physics.arcade.collide(
                this.player.blast,
                this.wizard,
                (blast, wizard)=>{
                    blast.kill();
                    wizard.damage(1);
                    // if health is 0 play death sound.
                    if(!this.boarOuchSound.isPlaying){
                       this.boarOuchSound.play();
                    }
                    let tween = this.game.add.tween(wizard).to(
                            { alpha: 0 },
                            100, "Linear", true);
                    tween.onComplete.add(()=>{
                            this.game.add.tween(wizard).to(
                                    { alpha: 1 },
                                    100, "Linear", true);
                    });
                },
                null, this
            );

            this.game.physics.arcade.collide(this.wizard_blasts, this.platforms);
        }
        // Portals
        if (this.portals && this.game.followers) {
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
            this.game.physics.arcade.collide(
                this.game.followers,
                this.silent_portals,
            );
            this.game.physics.arcade.collide(
                this.player,
                this.silent_portals,
            );
        }

        // Followers
        if (this.game.followers) {
            //let should_move = this.player.is_moving;
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
                    // this probably breaks things.
                    //else if (this.player.y > person.y && should_move){
                    else if (this.player.y > person.y ){
                    //else{
                        this.game.physics.arcade.moveToObject(
                            person, this.player, 50+(index*15));
                    }
                }
            });


            // level ends when slowest follower collides with goal
            this.game.physics.arcade.collide(this.player,
                this.house,
                (player, house) => {
                    player.visible = false;
                    player.body.x += player.scale.x * 12; // make sure all followers collide w/ goal
                    player.can_jump = false;
                    player.can_shoot = false;
                    if (!this.goalMusic.isPlaying) {
                        if (!player.reached_goal) {
                            player.reached_goal = true;
                            this.goalMusic.play();
                        }
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
                this.player.blast,
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
                100, "Linear", true);
        tween.onComplete.add(()=>{
                this.game.add.tween(playerish).to(
                        { alpha: 1 },
                        100, "Linear", true);
                });
        if(!this.playerOuchSound.isPlaying){
           this.playerOuchSound.play();
        }
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
        else if (this.player.body.touching.down) {
            this.player.body.velocity.y -= 200;
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
        if(!this.boarOuchSound.isPlaying){
           this.boarOuchSound.play();
        }
        let tween;
        tween = this.game.add.tween(boar).to(
                { alpha:  0},
                300, "Linear", true);
        tween.onComplete.add(()=>{
            boar.kill();
        })
    }
}

export { Main };
