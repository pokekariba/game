import { TipoCarta } from '../../@types/Carta';
import { TipoTabuleiro } from '../../@types/game/TipoTabuleiroEnum';
import { Battle } from '../scenes/Battle';
import { Carta } from './Carta';

export class Tabuleiro extends Phaser.GameObjects.Container {
  public scene: Battle;
  private imagemTabuleiro: Phaser.GameObjects.Image;
  private cartasTabuleiro: Carta[][] = [];
  private posicoesSetoresBase: {
    x: number;
    y: number;
    rotation: number;
    circle: Phaser.GameObjects.Graphics;
  }[] = [];
  private readonly TOP_SPACING_PERCENT = 0.025;
  private readonly HEIGHT_PERCENT = 0.9;
  private readonly HEIGHT_OFFSET_PX = 140;
  private readonly NUMERO_SETORES = 8;
  private readonly PROFUNDIDADE_POR_CARTA = 2;
  private readonly PROFUNDIDADE_TABULEIRO = 10;
  private readonly OFFSET_PILHA_Y = -5;
  private readonly OFFSET_PILHA_X = 15;
  private readonly ESCALA_CARTA = 0.3;

  private modoSelecaoCoringaAtivo: boolean = false;
  private cartaCoringaEmEspera: Carta | null = null;

  private readonly COR_DESTAQUE_SELECIONAVEL = 0x00ff00;
  private readonly ALPHA_DESTAQUE = 0.6;
  private readonly RAIO_DESTAQUE_SECTOR = 70;

  constructor(scene: Battle, tipoTabuleiro: TipoTabuleiro) {
    super(scene, 0, 0);
    this.scene = scene;
    this.imagemTabuleiro = this.scene.add.image(0, 0, tipoTabuleiro);
    this.imagemTabuleiro.setOrigin(0.5);
    this.imagemTabuleiro.setDepth(this.PROFUNDIDADE_TABULEIRO);
    this.add(this.imagemTabuleiro);

    for (let i = 0; i < this.NUMERO_SETORES; i++) {
      this.cartasTabuleiro.push([]);
    }

    this.redimencionarTabuleiro();

    this.scene.scale.on(
      Phaser.Scale.Events.RESIZE,
      this.redimencionarTabuleiro,
      this,
    );

    this.scene.add.existing(this);
  }

  public trocarImagem(novaImagemKey: TipoTabuleiro): void {
    if (this.imagemTabuleiro.texture.key !== novaImagemKey) {
      this.imagemTabuleiro.setTexture(novaImagemKey);
    }
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

    this.imagemTabuleiro.setPosition(0, 0);
    this.setPosition(boardX, boardY);

    this.calcularPosicoesSetoresBase();
    this.atualizarLayoutTodosSetores(false);
  }

  private calcularPosicoesSetoresBase() {
    this.posicoesSetoresBase.forEach((pos) => {
      if (pos.circle) {
        pos.circle.destroy();
      }
    });
    this.posicoesSetoresBase = [];

    const centroX = this.imagemTabuleiro.x;
    const centroY = this.imagemTabuleiro.y;
    const raioQuadrado = (this.imagemTabuleiro.displayHeight / 2) * 0.65;

    for (let i = 0; i < this.NUMERO_SETORES * 2; i++) {
      if (i % 2 === 0) continue;
      const setorActualIndex = Math.floor(i / 2);
      const anguloSetor = Phaser.Math.DegToRad(
        90 + (-360 / (this.NUMERO_SETORES * 2)) * i,
      );

      const x = centroX + Math.cos(anguloSetor) * raioQuadrado;
      const y = centroY + Math.sin(anguloSetor) * raioQuadrado;

      const circle = this.scene.add.graphics();
      circle.setDepth(this.PROFUNDIDADE_TABULEIRO + 1);
      circle.setAlpha(0);
      circle.setInteractive(
        new Phaser.Geom.Circle(0, 0, this.RAIO_DESTAQUE_SECTOR),
        Phaser.Geom.Circle.Contains,
      );
      circle.on('pointerdown', () => {
        if (this.modoSelecaoCoringaAtivo) {
          this.finalizarSelecaoCoringa(setorActualIndex);
        }
      });
      this.add(circle);
      circle.setPosition(x, y);

      this.posicoesSetoresBase.push({
        x,
        y,
        rotation: anguloSetor,
        circle: circle,
      });
    }
  }

  private localToGlobal(xLocal: number, yLocal: number): Phaser.Math.Vector2 {
    const tempPoint = new Phaser.Math.Vector2(xLocal, yLocal);
    const transformedPoint = this.getLocalTransformMatrix().transformPoint(
      tempPoint.x,
      tempPoint.y,
    );
    return new Phaser.Math.Vector2(transformedPoint.x, transformedPoint.y);
  }

  private async atualizarLayoutSetor(
    setorIndex: number,
    comAnimacao: boolean = true,
  ): Promise<void> {
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

      const targetXLocal = basePos.x + rotatedOffsetX;
      const targetYLocal = basePos.y + rotatedOffsetY;

      const globalPoint = this.localToGlobal(targetXLocal, targetYLocal);
      const targetXGlobal = globalPoint.x;
      const targetYGlobal = globalPoint.y;

      const targetRotation = basePos.rotation + Phaser.Math.DegToRad(-90);

      const targetDepth =
        this.PROFUNDIDADE_TABULEIRO + index * this.PROFUNDIDADE_POR_CARTA;

      return new Promise<void>((resolve) => {
        if (comAnimacao) {
          this.scene.tweens.add({
            targets: carta,
            x: targetXGlobal,
            y: targetYGlobal,
            rotation: targetRotation,
            scaleX: this.ESCALA_CARTA,
            scaleY: this.ESCALA_CARTA,
            duration: 250,
            ease: 'Power2',
            onComplete: () => {
              carta.setProfundidade(targetDepth);
              resolve();
            },
          });
        } else {
          carta.setPosition(targetXGlobal, targetYGlobal);
          carta.setRotation(targetRotation);
          carta.setProfundidade(targetDepth);
          resolve();
        }
      });
    });
  }

  private atualizarLayoutTodosSetores(comAnimacao: boolean = false) {
    for (let i = 0; i < this.NUMERO_SETORES; i++) {
      this.atualizarLayoutSetor(i, comAnimacao);
    }
  }

  public async jogarCarta(carta: Carta, valorRodada?: number): Promise<void> {
    const dados = carta.getDadosCarta();

    if (!dados.valor && !valorRodada) {
      this.cartaCoringaEmEspera = carta;
      this.ativarModoSelecaoCoringa();
    } else {
      const indexSetor = (valorRodada || dados.valor) - 1;
      await this.colocarCartaNoSetor(carta, indexSetor);
    }
  }

  private async colocarCartaNoSetor(
    carta: Carta,
    indexSetor: number,
  ): Promise<void> {
    const dados = carta.getDadosCarta();
    dados.tipo = TipoCarta.mesa;
    carta.setInteractive();
    const setorTabuleiro = this.cartasTabuleiro[indexSetor];
    dados.posicao = setorTabuleiro.length;
    setorTabuleiro.push(carta);
    await this.atualizarLayoutSetor(indexSetor);
  }

  private ativarModoSelecaoCoringa(): void {
    this.modoSelecaoCoringaAtivo = true;
    this.posicoesSetoresBase.forEach((pos) => {
      if (pos.circle) {
        pos.circle.fillStyle(
          this.COR_DESTAQUE_SELECIONAVEL,
          this.ALPHA_DESTAQUE,
        );
        pos.circle.fillCircle(0, 0, this.RAIO_DESTAQUE_SECTOR);
        pos.circle.setAlpha(this.ALPHA_DESTAQUE);
        pos.circle.setInteractive();
      }
    });
    console.log(
      'Modo de seleção de setor para coringa ativado. Clique em um setor.',
    );
  }

  private desativarModoSelecaoCoringa(): void {
    this.modoSelecaoCoringaAtivo = false;
    this.cartaCoringaEmEspera = null;
    this.posicoesSetoresBase.forEach((pos) => {
      if (pos.circle) {
        pos.circle.setAlpha(0);
        pos.circle.disableInteractive();
      }
    });
    console.log('Modo de seleção de setor para coringa desativado.');
  }

  private finalizarSelecaoCoringa(setorIndex: number): void {
    if (this.cartaCoringaEmEspera) {
      this.colocarCartaNoSetor(this.cartaCoringaEmEspera, setorIndex);
      this.desativarModoSelecaoCoringa();
      this.scene.events.emit('carta_coringa_jogada', setorIndex + 1);
    } else {
      console.warn('Nenhuma carta coringa em espera para finalizar a seleção.');
    }
  }

  public async removerCartaDoCampo(
    cartaId: number,
    indexSetor: number,
  ): Promise<Carta | null> {
    const setor = this.cartasTabuleiro[indexSetor];

    const indiceCarta = setor.findIndex(
      (c) => c.getDadosCarta().id === cartaId,
    );

    if (indiceCarta > -1) {
      const cartaRemovida = setor.splice(indiceCarta, 1)[0];
      await this.atualizarLayoutSetor(indexSetor);
      return cartaRemovida;
    }
    return null;
  }

  public removerTodasCartasDoSetor(indexSetor: number): Carta[] {
    const cartasSetor = [...this.cartasTabuleiro[indexSetor]];
    this.cartasTabuleiro[indexSetor] = [];
    return cartasSetor;
  }

  public getCartasTabuleiro() {
    return this.cartasTabuleiro;
  }

  public destroy() {
    this.scene.scale.off(
      Phaser.Scale.Events.RESIZE,
      this.redimencionarTabuleiro,
      this,
    );
    this.imagemTabuleiro.destroy();
    this.posicoesSetoresBase.forEach((pos) => {
      if (pos.circle) {
        pos.circle.destroy();
      }
    });
    super.destroy();
  }
}
