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
    this.load.image('verso', '/assets/verso.webp');

    // Icones de tipo - usar caminho absoluto direto
    this.load.image('tipo0', '/assets/tipos/normal.webp');
    this.load.image('tipo1', '/assets/tipos/metal.webp');
    this.load.image('tipo2', '/assets/tipos/lutador.webp');
    this.load.image('tipo3', '/assets/tipos/psiquico.webp');
    this.load.image('tipo4', '/assets/tipos/sombrio.webp');
    this.load.image('tipo5', '/assets/tipos/grama.webp');
    this.load.image('tipo6', '/assets/tipos/agua.webp');
    this.load.image('tipo7', '/assets/tipos/fogo.webp');
    this.load.image('tipo8', '/assets/tipos/eletrico.webp');

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

    this.load.image('avatarUsuario', this.skins.avatarUsuario);
    this.load.image('avatarAdversario', this.skins.avatarAdversario);
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
