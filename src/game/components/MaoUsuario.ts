import { DadosCarta } from '../../@types/Carta';
import { Battle } from '../scenes/Battle';
import { Carta } from './Carta';

export class MaoUsuario {
  private cena: Battle;
  private cartasNaMao: Carta[] = [];
  private cartasNaMaoId: number[] = [];
  private posicoesMaoBase: Phaser.Geom.Point[] = [];

  private readonly OFFSET_ALTURA_PX = 100;
  private readonly ESPACAMENTO_CARTA_PX_NORMAL = 80;
  private readonly HOVER_SCALE_FACTOR = 1.2;
  private readonly HOVER_OFFSET_Y = -30;
  private readonly FANNED_OFFSET_X = 30;
  private readonly PROFUNDIDADE_HOVER = 100;
  private readonly TWEEN_DURATION = 100;

  private cartaEmHover: Carta | null = null;
  private tweensAtivos: Phaser.Tweens.Tween[] = [];

  constructor(cena: Battle, cartasIniciais: DadosCarta[]) {
    this.cena = cena;

    this.calcularPosicoesMaoBase();
    this.atualizarCartas(cartasIniciais);

    this.cena.scale.on(
      Phaser.Scale.Events.RESIZE,
      () => {
        this.calcularPosicoesMaoBase();
        this.atualizarLayoutMao(false);
      },
      this,
    );

    this.cena.events.on('carta_hover_in_mao', this.aoPassarMouseNaCarta, this);
    this.cena.events.on('carta_unhover_in_mao', this.aoSairMouseDaCarta, this);
  }

  private calcularPosicoesMaoBase() {
    const larguraJogo = this.cena.scale.width;
    const alturaJogo = this.cena.scale.height;

    const inicioY = alturaJogo - this.OFFSET_ALTURA_PX;
    const larguraTotalMao = 5 * this.ESPACAMENTO_CARTA_PX_NORMAL;
    const inicioX =
      (larguraJogo - larguraTotalMao) / 2 +
      this.ESPACAMENTO_CARTA_PX_NORMAL / 2;

    this.posicoesMaoBase = [];
    for (let i = 0; i < 5; i++) {
      this.posicoesMaoBase.push(
        new Phaser.Geom.Point(
          inicioX + i * this.ESPACAMENTO_CARTA_PX_NORMAL,
          inicioY,
        ),
      );
    }
  }

  private atualizarLayoutMao(comAnimacao: boolean = true) {
    this.pararTweensAtivos();

    this.cartasNaMao.forEach((carta, indice) => {
      let targetX = this.posicoesMaoBase[indice].x;
      let targetY = this.posicoesMaoBase[indice].y;
      let targetScale = carta.getEscalaOriginal();
      let targetDepth = (this.cartasNaMao.length - indice) * 10;

      if (this.cartaEmHover) {
        const indiceHover = this.cartasNaMao.indexOf(this.cartaEmHover);

        if (indiceHover !== -1) {
          if (indice < indiceHover) {
            targetX -= this.FANNED_OFFSET_X;
          } else if (indice > indiceHover) {
            targetX += this.FANNED_OFFSET_X;
          }
        }

        if (carta === this.cartaEmHover) {
          targetY += this.HOVER_OFFSET_Y;
          targetScale *= this.HOVER_SCALE_FACTOR;
          targetDepth = this.PROFUNDIDADE_HOVER;
        }
      }

      if (comAnimacao) {
        const tween = this.cena.tweens.add({
          targets: carta,
          x: targetX,
          y: targetY,
          scaleX: targetScale,
          scaleY: targetScale,
          duration: this.TWEEN_DURATION,
          ease: 'Power2',
          onComplete: () => {
            carta.setProfundidade(targetDepth);
          },
        });
        this.tweensAtivos.push(tween);
      } else {
        carta.setPosition(targetX, targetY);
        carta.setScale(targetScale);
        carta.setProfundidade(targetDepth);
      }
    });
  }

  private pararTweensAtivos() {
    this.tweensAtivos.forEach((tween) => tween.stop());
    this.tweensAtivos = [];
  }

  public atualizarCartas(dadosCartas: DadosCarta[]): void {
    this.pararTweensAtivos();

    this.cartasNaMao = dadosCartas
      .sort((a, b) => a.posicao - b.posicao)
      .map((carta) => {
        if (this.cartasNaMaoId.includes(carta.id))
          return this.cartasNaMao[carta.posicao];
        this.cartasNaMaoId[carta.posicao] = carta.id;
        const widthCarta = this.cartasNaMao[0]
          ? this.cartasNaMao[0].displayWidth
          : this.cena.scale.width / 2;
        return new Carta(
          this.cena,
          -widthCarta,
          this.cena.scale.height / 2,
          carta,
          true,
        );
      });

    this.atualizarLayoutMao();
  }

  public removerCarta(cartaId: number): Carta | null {
    const indice = this.cartasNaMaoId.indexOf(cartaId);
    if (indice > -1) {
      const cartaRemovida = this.cartasNaMao.splice(indice, 1)[0];
      this.cartasNaMaoId.splice(indice, 1);

      cartaRemovida.off('pointerover');
      cartaRemovida.off('pointerout');

      this.cartasNaMao.forEach((carta, index) => {
        carta.getDadosCarta().posicao = index;
      });

      if (this.cartaEmHover === cartaRemovida) {
        this.cartaEmHover = null;
      }

      this.atualizarLayoutMao(true);
      return cartaRemovida;
    }
    return null;
  }

  public obterCartas(): Carta[] {
    return this.cartasNaMao;
  }

  private aoPassarMouseNaCarta(carta: Carta) {
    if (this.cartaEmHover === carta) {
      return;
    }

    if (this.cartaEmHover && this.cartaEmHover !== carta) {
      this.aoSairMouseDaCarta(this.cartaEmHover);
    }

    this.cartaEmHover = carta;
    this.atualizarLayoutMao(true);

    this.cena.input.setDefaultCursor('pointer');
  }

  private aoSairMouseDaCarta(carta: Carta) {
    if (this.cartaEmHover !== carta) {
      return;
    }

    this.cartaEmHover = null;
    this.atualizarLayoutMao(true);

    if (this.cartaEmHover === null) {
      this.cena.input.setDefaultCursor('default');
    }
  }

  destroy() {
    this.cena.scale.off(Phaser.Scale.Events.RESIZE);

    this.cena.events.off('carta_hover_in_mao', this.aoPassarMouseNaCarta, this);
    this.cena.events.off('carta_unhover_in_mao', this.aoSairMouseDaCarta, this);

    this.pararTweensAtivos();

    this.cartasNaMao.forEach((carta) => {
      carta.off('pointerover');
      carta.off('pointerout');
      carta.destroy();
    });
    this.cartasNaMao = [];
    this.cartasNaMaoId = [];
  }
}
