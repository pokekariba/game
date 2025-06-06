import { Scene } from 'phaser';
import { useGameStore } from '../../store/useGameStore';
import { SkinPatida } from '../../@types/SkinPartida';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  async init () {
    const skins = await new Promise<SkinPatida>((resolve,reject) => {
      const checkSkins = setInterval(() => {
        const skinStore = useGameStore.getState().skinPartida;
        if (skinStore) {
          checkSkins.close();
          resolve(skinStore);
        }
      },500);
      setTimeout(() => {
        checkSkins.close();
        reject();
      },5000)
    });


  }

  preload() {
    this.load.setPath('assets');
    this.load.image('logo', 'logo.png');
  }

  create() {
    this.scene.start('Login');
  }
}
