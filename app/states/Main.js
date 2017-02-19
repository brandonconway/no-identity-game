import {IdentityPlayer} from "../components/Player.js"
import {Goal} from "../components/Goal.js"

class Main extends Phaser.State {

    init (level) {
        this.game.addFullScreenButton();
        this.game.gravity = 1000;
        this.level = level;
    }

    create() {
        var x, y;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.addTouch(this);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.add.button(this.width-20, 0,
                                 'pauseButton',
                                  this.game.pauseGame, this
                             );

        this.game.stage.backgroundColor = 'black';
        let win_text = this.game.add.text(
            this.game.width/2,
            this.game.height/2,
            `Level ${this.level} complete!`,
            this.game.headerStyle);

        win_text.anchor.set(0.5);
        win_text.visible = false;
        this.game.win_text = win_text;

        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;
        var ground = this.platforms.create(-100, this.game.world.height -16, 'ground');
        ground.scale.setTo(100, 1);
        ground.body.immovable = true;

        var ledge = this.platforms.create(-100, 125, 'ground');
        ledge.body.immovable = true;
        ledge.scale.setTo(20, 0.5);
        ledge =this.platforms.create(200, 275, 'ground');
        ledge.body.immovable = true;
        ledge.scale.setTo(50, 0.5);

        // Player
        x = 5;
        y = 0;
        this.player = new IdentityPlayer(this.game, x, y, 'player');
        this.game.add.existing(this.player);

        // Group
        this.groupers = this.game.add.group();
        this.groupers.enableBody = true;
        for (var i = 0; i < 6; i++)
        {
            x = 0 - (40 + i);
            y = 0;
            this.groupers.create(x, y, 'player');
        }
        this.groupers.children.forEach((person, index)=>{
            person.body.gravity.y = this.game.gravity;
        });
        this.game.physics.enable(this.groupers, Phaser.Physics.ARCADE);

        // Goal
        x = this.game.width*0.97;
        y = this.game.world.height - 77;
        this.house = new Goal(this.game, x, y, 'house');
        this.game.add.existing(this.house);

        // Music
        this.mainMusic = this.add.audio('mainMusic');
        this.mainMusic.loop = true;
        if(!this.mainMusic.isPlaying){
            this.mainMusic.play();
        }

    }

    update() {
        this.player.body.velocity.x = 0;

        this.game.physics.arcade.collide(this.player, this.platforms);
        this.game.physics.arcade.collide(this.groupers, this.platforms);
        // first_grouper is slowest.
        let slowest_grouper = this.groupers.children[0];
        this.game.physics.arcade.collide(slowest_grouper, this.house, this.game.winLevel, null, this);




        if (this.cursors.left.isDown)
        {
            this.player.body.velocity.x = -70;
            this.player.scale.x = 1;
            this.groupers.children.forEach((person, index)=>{
                if (person.body.touching.down) {
                    this.game.physics.arcade.moveToObject(person, this.player, 60+(index*10));
                }
            });
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = 70;
            this.player.scale.x = -1;
            this.groupers.children.forEach((person, index)=>{
                if (person.body.touching.down) {
                    this.game.physics.arcade.moveToObject(person, this.player, 60+(index*10));
                }
            });
        }
        else {
            this.player.body.velocity.x = 0;
            this.groupers.children.forEach((person, index)=>{
                if (person.body.touching.down) {
                    this.game.physics.arcade.moveToObject(person, this.player, 60+index);
                }
            });
        }

        /*
        move players on a path

        if ( this.speed % this.step === 0) {
            this.player_group.children.forEach((player, index)=>{
                let i = this.pi - index * this.offset;
                if ( i < 0 ) { i = 0; }
                player.x = this.path[i].x;
                player.y = this.path[i].y;
            });
            this.pi++;
        }

        this.speed++;

        if (this.pi >= this.path.length)
        {
            this.pi = 0;
        }
        */
    }

}

export { Main };
