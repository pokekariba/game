// src/objects/Board.ts

import { TipoCarta } from '../../@types/Carta';
import { TipoTabuleiro } from '../../@types/game/TipoTabuleiroEnum';
import { Battle } from '../scenes/Battle';
import { Carta } from './Carta';

export class Tabuleiro {
  private scene: Battle;
  private imagemTabuleiro: Phaser.GameObjects.Image;
  private cartasTabuleiro: Carta[][] = [];
  private posicoesSetoresBase: { x: number; y: number; rotation: number }[] =
    [];
  private readonly TOP_SPACING_PERCENT = 0.025; // 5% de espaçamento no topo
  private readonly HEIGHT_PERCENT = 0.9; // 90% da altura da tela
  private readonly HEIGHT_OFFSET_PX = 140; // -140px de altura final
  private readonly NUMERO_SETORES = 8;
  private readonly PROFUNDIDADE_POR_CARTA = 2;
  private readonly PROFUNDIDADE_TABULEIRO = 10;
  private readonly OFFSET_PILHA_Y = -5;
  private readonly OFFSET_PILHA_X = 5;
  private readonly ESCALA_CARTA = 0.25;

  constructor(scene: Battle, tipoTabuleiro: TipoTabuleiro) {
    this.scene = scene;
    this.imagemTabuleiro = this.scene.add.image(0, 0, tipoTabuleiro);
    this.imagemTabuleiro.setOrigin(0.5);
    this.imagemTabuleiro.setDepth(this.PROFUNDIDADE_TABULEIRO);

    for (let i = 0; i < this.NUMERO_SETORES; i++) {
      this.cartasTabuleiro.push([]);
    }

    this.redimencionarTabuleiro();

    this.scene.scale.on(
      Phaser.Scale.Events.RESIZE,
      this.redimencionarTabuleiro,
      this,
    );
  }

  private redimencionarTabuleiro() {
    const gameWidth = this.scene.scale.width;
    const gameHeight = this.scene.scale.height;

    const boardTopY = gameHeight * this.TOP_SPACING_PERCENT;

    const desiredBoardHeight =
      gameHeight * this.HEIGHT_PERCENT - this.HEIGHT_OFFSET_PX;

    const originalBoardHeight = this.imagemTabuleiro.height;
    const scaleY = desiredBoardHeight / originalBoardHeight;
    const scaleX = scaleY;

    this.imagemTabuleiro.setScale(scaleX, scaleY);

    const boardX = gameWidth / 2;

    const boardY = boardTopY + this.imagemTabuleiro.displayHeight / 2;

    this.imagemTabuleiro.setPosition(boardX, boardY);

    this.calcularPosicoesSetoresBase();
    this.atualizarLayoutTodosSetores(false);
  }

  private calcularPosicoesSetoresBase() {
    this.posicoesSetoresBase = [];
    const centroX = this.imagemTabuleiro.x;
    const centroY = this.imagemTabuleiro.y;
    const raioQuadrado = (this.imagemTabuleiro.displayHeight / 2) * 0.65;

    for (let i = 0; i < this.NUMERO_SETORES * 2; i++) {
      if (i % 2 === 0) continue;
      const anguloSetor = Phaser.Math.DegToRad(
        90 + (-360 / (this.NUMERO_SETORES * 2)) * i,
      );

      const x = centroX + Math.cos(anguloSetor) * raioQuadrado;
      const y = centroY + Math.sin(anguloSetor) * raioQuadrado;

      this.posicoesSetoresBase.push({ x, y, rotation: anguloSetor });
    }
  }

  private atualizarLayoutSetor(
    setorIndex: number,
    comAnimacao: boolean = true,
  ) {
    const basePos = this.posicoesSetoresBase[setorIndex];
    const cartasNoSetor = this.cartasTabuleiro[setorIndex];

    cartasNoSetor.forEach((carta, index) => {
      const localOffsetX = this.OFFSET_PILHA_X * index;
      const localOffsetY = this.OFFSET_PILHA_Y * index;

      const rotatedOffsetX =
        localOffsetX * Math.cos(basePos.rotation) -
        localOffsetY * Math.sin(basePos.rotation);
      const rotatedOffsetY =
        localOffsetX * Math.sin(basePos.rotation) +
        localOffsetY * Math.cos(basePos.rotation);

      const targetX = basePos.x + rotatedOffsetX;
      const targetY = basePos.y + rotatedOffsetY;

      const targetRotation = basePos.rotation + Phaser.Math.DegToRad(-90); // Todas as cartas na pilha têm a mesma rotação do setor

      const targetDepth =
        this.PROFUNDIDADE_TABULEIRO + index * this.PROFUNDIDADE_POR_CARTA;

      if (comAnimacao) {
        this.scene.tweens.add({
          targets: carta,
          x: targetX,
          y: targetY,
          rotation: targetRotation,
          scaleX: this.ESCALA_CARTA,
          scaleY: this.ESCALA_CARTA,
          duration: 250,
          ease: 'Power2',
          onComplete: () => {
            carta.setProfundidade(targetDepth);
          },
        });
      } else {
        carta.setPosition(targetX, targetY);
        carta.setRotation(targetRotation);
        carta.setProfundidade(targetDepth);
      }
    });
  }

  private atualizarLayoutTodosSetores(comAnimacao: boolean = false) {
    for (let i = 0; i < this.NUMERO_SETORES; i++) {
      this.atualizarLayoutSetor(i, comAnimacao);
    }
  }

  public jogarCarta(carta: Carta, valorCamaleao?: number) {
    const dados = carta.getDadosCarta();
    const indexSetor = dados.valor - 1;
    dados.tipo = TipoCarta.mesa;
    carta.setInteractive();

    let setorTabuleiro!: Carta[];
    if (dados.valor === 0 && valorCamaleao) {
      setorTabuleiro = this.cartasTabuleiro[valorCamaleao];
    } else {
      setorTabuleiro = this.cartasTabuleiro[indexSetor];
    }
    dados.posicao = setorTabuleiro.length;
    setorTabuleiro.push(carta);

    this.atualizarLayoutSetor(indexSetor);
  }

  public removerCartaDoCampo(cartaId: number, valor: number): Carta | null {
    const setor = this.cartasTabuleiro[valor];

    const indiceCarta = setor.findIndex(
      (c) => c.getDadosCarta().id === cartaId,
    );

    if (indiceCarta > -1) {
      const cartaRemovida = setor.splice(indiceCarta, 1)[0];
      this.atualizarLayoutSetor(valor);
      return cartaRemovida;
    }
    return null;
  }

  public destroy() {
    this.scene.scale.off(
      Phaser.Scale.Events.RESIZE,
      this.redimencionarTabuleiro,
      this,
    );
    this.imagemTabuleiro.destroy();
  }
}
