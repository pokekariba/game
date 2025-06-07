import { Battle } from './scenes/Battle';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import RexWebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js';

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  transparent: true,
  disableContextMenu: true,
  fps: { target: 60 },
  dom: { createContainer: true },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  plugins: {
    global: [
      {
        key: 'rexWebFontLoader',
        plugin: RexWebFontLoaderPlugin,
        start: true,
      },
    ],
  },
  scene: [Preloader, Battle],
};

const StartGame = (parent: HTMLElement) => {
  return new Game({ ...config, parent });
};

export default StartGame;
