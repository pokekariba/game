import { Boot } from './scenes/Boot';
import { Battle } from './scenes/Battle';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1920,
  height: 1080,
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: 'game-container',
  backgroundColor: '#028af8',
  scene: [Boot, Preloader, Battle],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
