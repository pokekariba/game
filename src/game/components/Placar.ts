import { Scene, GameObjects } from 'phaser';
import {
  MapeamentoIconesTipos,
  TipoElemento,
  TiposPorIndice,
} from '../../@types/game/TiposJogo';

interface TipoContadorItem {
  fundo: GameObjects.Graphics; // Adicionado o fundo
  icone: GameObjects.Image;
  contadorTexto: GameObjects.Text;
  tipo: TipoElemento;
}

export class Placar {
  private cena: Scene;
  private contadores: Map<TipoElemento, number>;
  private elementosVisuais: TipoContadorItem[] = [];
  private xInicial = 0;
  private yInicial = 0;

  private readonly ESPACAMENTO_Y = 60;
  private readonly TAMANHO_ICONE_PX = 40;
  private readonly TAMANHO_FONTE_CONTADOR = '24px';

  private readonly FUNDO_COR = 0xffffff;
  private readonly FUNDO_ALPHA = 1;
  private readonly FUNDO_RAIO_BORDA = 20;
  private readonly PADDING_X_FUNDO = 15;

  constructor(cena: Scene, x: number, y: number, numerosIniciais: number[]) {
    this.cena = cena;
    this.contadores = new Map<TipoElemento, number>();
    this.xInicial = x;
    this.yInicial = y;
    this.criarPlacar(numerosIniciais);

    this.cena.scale.on(
      Phaser.Scale.Events.RESIZE,
      this.aoRedimensionarTela,
      this,
    );
  }

  private criarPlacar(numerosIniciais: number[]) {
    this.elementosVisuais.forEach((item) => {
      item.fundo.destroy();
      item.icone.destroy();
      item.contadorTexto.destroy();
    });
    this.elementosVisuais = [];

    if (numerosIniciais.length !== TiposPorIndice.length) {
      console.warn(
        'PlacarTipo: O array de números iniciais não corresponde ao número de tipos definidos.',
      );
    }

    TiposPorIndice.forEach((tipo, index) => {
      const numeroInicial = numerosIniciais[index] || 0;

      this.contadores.set(tipo, numeroInicial);

      const yPos = this.yInicial + index * this.ESPACAMENTO_Y;

      const iconeKey = MapeamentoIconesTipos.get(tipo);
      if (!iconeKey) {
        console.error(
          `PlacarTipo: Chave de ícone não encontrada para o tipo ${tipo}.`,
        );
        return;
      }
      const icone = this.cena.add
        .image(this.xInicial, yPos, iconeKey)
        .setOrigin(0.5)
        .setDepth(201);

      const escalaNecessaria = this.TAMANHO_ICONE_PX / icone.width;
      icone.setScale(escalaNecessaria);

      const xPosTexto = this.xInicial + this.TAMANHO_ICONE_PX / 2 + 10;
      const contadorTexto = this.cena.add
        .text(xPosTexto, yPos, numeroInicial.toString(), {
          fontFamily: 'Arial',
          fontSize: this.TAMANHO_FONTE_CONTADOR,
          color: '#000000',
        })
        .setOrigin(0, 0.5)
        .setDepth(201);

      const fundo = this.cena.add.graphics({ x: 0, y: 0 });
      fundo.setDepth(200);

      const larguraConteudo = this.TAMANHO_ICONE_PX + 10 + contadorTexto.width;
      const alturaConteudo = Math.max(
        this.TAMANHO_ICONE_PX,
        contadorTexto.height,
      );

      const larguraFundo = larguraConteudo + 2 * this.PADDING_X_FUNDO;
      const alturaFundo = alturaConteudo;

      const xPosFundo =
        this.xInicial -
        this.TAMANHO_ICONE_PX / 2 -
        this.PADDING_X_FUNDO +
        larguraFundo / 2;

      fundo.fillStyle(this.FUNDO_COR, this.FUNDO_ALPHA);
      fundo.fillRoundedRect(
        xPosFundo - this.TAMANHO_ICONE_PX / 1.5,
        yPos - alturaFundo / 2,
        larguraFundo,
        alturaFundo,
        this.FUNDO_RAIO_BORDA,
      );

      this.elementosVisuais.push({ fundo, icone, contadorTexto, tipo });
    });
  }

  private aoRedimensionarTela() {
    const numerosAtuais = TiposPorIndice.map(
      (tipo) => this.contadores.get(tipo) || 0,
    );
    this.criarPlacar(numerosAtuais);
  }

  public atualizarContador(tipo: TipoElemento, novoNumero: number): void {
    this.contadores.set(tipo, novoNumero);
    const item = this.elementosVisuais.find((el) => el.tipo === tipo);
    if (item) {
      item.contadorTexto.setText(novoNumero.toString());

      this.reajustarFundo(item);
    }
  }

  public incrementarContador(tipo: TipoElemento, valor: number = 1): void {
    const numeroAtual = this.contadores.get(tipo) || 0;
    this.atualizarContador(tipo, numeroAtual + valor);
  }

  private reajustarFundo(item: TipoContadorItem): void {
    item.fundo.clear();

    const larguraConteudo =
      this.TAMANHO_ICONE_PX + 10 + item.contadorTexto.width;
    const alturaConteudo = Math.max(
      this.TAMANHO_ICONE_PX,
      item.contadorTexto.height,
    );

    const larguraFundo = larguraConteudo + 2 * this.PADDING_X_FUNDO;
    const alturaFundo = alturaConteudo;

    const xPosFundo =
      this.xInicial -
      this.TAMANHO_ICONE_PX / 2 -
      this.PADDING_X_FUNDO +
      larguraFundo / 2;
    const yPos = item.icone.y;

    item.fundo.fillStyle(this.FUNDO_COR, this.FUNDO_ALPHA);
    item.fundo.fillRoundedRect(
      xPosFundo - larguraFundo / 2,
      yPos - alturaFundo / 2,
      larguraFundo,
      alturaFundo,
      this.FUNDO_RAIO_BORDA,
    );
  }

  public destruir(): void {
    this.cena.scale.off(
      Phaser.Scale.Events.RESIZE,
      this.aoRedimensionarTela,
      this,
    );
    this.elementosVisuais.forEach((item) => {
      item.fundo.destroy();
      item.icone.destroy();
      item.contadorTexto.destroy();
    });
    this.elementosVisuais = [];
    this.contadores.clear();
  }
}
