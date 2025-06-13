import { DadosCarta } from '../../@types/Carta';
import { Battle } from '../scenes/Battle';

export class Carta extends Phaser.GameObjects.Container {
  private dadosCarta: DadosCarta;
  private imagemCarta: Phaser.GameObjects.Image;
  private cena: Battle;
  private escalaOriginal: number;

  constructor(
    scene: Battle,
    x: number,
    y: number,
    dadosCarta: DadosCarta,
    cartaDoJogador: boolean,
  ) {
    super(scene, x, y);
    this.cena = scene;

    this.dadosCarta = dadosCarta;
    scene.add.existing(this);

    let nomeImagemCarta = '';

    if (cartaDoJogador) {
      nomeImagemCarta += 'cartasUsuario';
    } else {
      nomeImagemCarta += 'cartasAdversario';
    }

    nomeImagemCarta += dadosCarta.valor;

    this.imagemCarta = scene.add.image(0, 0, nomeImagemCarta);
    this.imagemCarta.setOrigin(0.5, 0.5);
    this.add(this.imagemCarta);

    this.escalaOriginal = 0.45;
    this.imagemCarta.setScale(this.escalaOriginal);

    this.setInteractive(
      new Phaser.Geom.Rectangle(
        -this.imagemCarta.displayWidth / 2,
        -this.imagemCarta.displayHeight / 2,
        this.imagemCarta.displayWidth,
        this.imagemCarta.displayHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );

    this.on('pointerover', this.onPointerOver, this);
    this.on('pointerout', this.onPointerOut, this);
    this.on('pointerdown', this.aoSerClicada, this);
  }

  private onPointerOver() {
    this.cena.events.emit('carta_hover_in_mao', this);
  }

  private onPointerOut() {
    this.cena.events.emit('carta_unhover_in_mao', this);
  }

  private aoSerClicada() {
    this.cena.events.emit('carta_clicada', this);
  }

  public getEscalaOriginal(): number {
    return this.escalaOriginal;
  }

  public getDadosCarta(): DadosCarta {
    return this.dadosCarta;
  }

  public setProfundidade(deph: number) {
    this.setDepth(deph);
  }
}
