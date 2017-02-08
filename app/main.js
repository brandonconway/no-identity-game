import {Game} from './Game.js';
import {Boot} from './states/Boot.js';

(function () {
    var game = new Game(800, 450, Phaser.AUTO, "game-container");
    game.state.add('Boot', Boot);
    game.state.start('Boot');
})();
