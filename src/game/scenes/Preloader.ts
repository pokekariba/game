import { Scene } from 'phaser';
import { useGameStore } from '../../store/useGameStore';
import { SkinPatida } from '../../@types/SkinPartida';

export class Preloader extends Scene {
  private skins!: SkinPatida;

  constructor() {
    super('Preloader');
  }

  public async init() {
    console.log('Preloader init');
    this.skins = await new Promise<SkinPatida>((resolve, reject) => {
      const skinPartida = useGameStore.getState().skinPartida;
      console.log(skinPartida);
      if (skinPartida) resolve(skinPartida);
      const unsub = useGameStore.subscribe((gameState) => {
        console.log(gameState);
        if (gameState.skinPartida) {
          unsub();
          clearTimeout(timer);
          resolve(gameState.skinPartida);
        }
      });
      const timer = setTimeout(() => {
        unsub();
        reject(new Error('Timeout ao esperar skinPartida'));
      }, 5000);
    });
  }

  public preload() {
    console.log('Preloader preload');
    this.load.image('tabuleiro', '/assets/tabuleiro.webp');
    this.load.image('tabuleiro-extend', '/assets/tabuleiro-extend.webp');

    this.load.rexWebFont({
      google: {
        families: ['Jersey 10'],
      },
    });

    this.load.on(Phaser.Loader.Events.COMPLETE, () => {
      console.log('Todos os assets do PRELOADER carregados!');
    });
  }

  public create() {
    console.log('Preloader create');

    console.log('skins no create', this.skins);

    this.load.image('fundo', this.skins.fundo);

    this.skins.cartasUsuario.forEach((carta, index) => {
      this.load.image(`cartasUsuario${index}`, carta);
    });

    this.skins.cartasAdversario.forEach((carta, index) => {
      this.load.image(`cartasAdversario${index}`, carta);
    });

    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.scene.start('Battle');
    });
    this.load.start();
  }
}
