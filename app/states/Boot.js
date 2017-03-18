import {Preloader} from "./Preloader.js"


class Boot extends Phaser.State {

     init () {
         this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
         if (!this.game.device.desktop) {
            // var width = window.innerWidth * window.devicePixelRatio;
             //var height = window.innerHeight * window.devicePixelRatio;
             //this.scale.setMinMax(width, height, width, height);
             this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
             this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
         }
     }

     preload () {
         this.load.image('preloaderBar', 'assets/images/preloader_bar.png');
     }

     create () {
         this.state.add('Preloader', Preloader);
         this.state.start('Preloader');
     }

 };

export {
    Boot
}
