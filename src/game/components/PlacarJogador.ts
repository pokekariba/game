import { Scene, GameObjects } from 'phaser';
import { Battle } from '../scenes/Battle';

export class PlacarJogador extends Phaser.GameObjects.Container {
  private cena: Scene;
  private imagemAvatar: GameObjects.Image;
  private avatarFundo: GameObjects.Graphics;
  private textoPontos: GameObjects.Text;
  private fundoPontos: GameObjects.Graphics;
  private textoNome: GameObjects.Text;
  private fundoNome: GameObjects.Graphics;

  private _pontuacao: number;
  private _nomeJogador: string;
  private _inverterOrdem: boolean;

  private readonly RAIO_AVATAR = 60;
  private readonly PADDING_AVATAR = 10;
  private readonly BORDA_AVATAR_ESPESSURA = 4;
  private readonly BORDA_AVATAR_COR = 0x004aad;
  private readonly BORDA_AVATAR_ALPHA = 1;

  private readonly TEXTO_FONT_SIZE = '24px';
  private readonly TEXTO_COLOR = '#000000';

  private readonly FUNDO_COR = 0xffffff;
  private readonly FUNDO_ALPHA = 1;
  private readonly FUNDO_RAIO_BORDA = 20;
  private readonly PADDING_TEXTO_X = 16;
  private readonly PADDING_TEXTO_Y = 4;
  private readonly AVATAR_FUNDO_COR = 0xffffff;
  private readonly AVATAR_FUNDO_ALPHA = 0.5;

  private readonly OFFSET_VERTICAL_PLACAR = 80;

  constructor(
    cena: Battle,
    x: number,
    y: number,
    imagemAvatarKey: string,
    nomeJogador: string,
    pontuacaoInicial: number,
    inverterOrdem: boolean = false,
  ) {
    super(cena, x, y);
    this.cena = cena;
    this._nomeJogador = nomeJogador;
    this._pontuacao = pontuacaoInicial;
    this._inverterOrdem = inverterOrdem;

    this.cena.add.existing(this);
    this.setDepth(250);

    this.criarAvatar(imagemAvatarKey);
    this.criarPlacarPontos();
    this.criarPlacarNome();

    this.cena.scale.on(
      Phaser.Scale.Events.RESIZE,
      this.aoRedimensionarTela,
      this,
    );
  }

  private criarAvatar(imagemAvatarKey: string): void {
    this.avatarFundo = this.cena.add.graphics();
    this.add(this.avatarFundo);

    this.imagemAvatar = this.cena.add
      .image(0, 0, imagemAvatarKey)
      .setOrigin(0.5);

    const diametroAlvo = (this.RAIO_AVATAR - this.PADDING_AVATAR) * 2;
    const escalaNecessaria =
      diametroAlvo /
      Math.max(this.imagemAvatar.width, this.imagemAvatar.height);
    this.imagemAvatar.setScale(escalaNecessaria);

    this.add(this.imagemAvatar);

    this.desenharAvatarFundo();
  }

  private desenharAvatarFundo(): void {
    this.avatarFundo.clear();

    this.avatarFundo.fillStyle(this.AVATAR_FUNDO_COR, this.AVATAR_FUNDO_ALPHA);
    // Desenha o círculo preenchido no tamanho do RAIO_AVATAR
    this.avatarFundo.fillCircle(0, 0, this.RAIO_AVATAR);
    this.avatarFundo.setDepth(0);

    this.avatarFundo.lineStyle(
      this.BORDA_AVATAR_ESPESSURA,
      this.BORDA_AVATAR_COR,
      this.BORDA_AVATAR_ALPHA,
    );
    this.avatarFundo.strokeCircle(0, 0, this.RAIO_AVATAR);
  }

  private criarPlacarPontos(): void {
    this.textoPontos = this.cena.add
      .text(0, 0, `Pontos: ${this._pontuacao}`, {
        fontFamily: '"Jersey 10"',
        fontSize: this.TEXTO_FONT_SIZE,
        color: this.TEXTO_COLOR,
      })
      .setOrigin(0.5);

    this.fundoPontos = this.cena.add.graphics();
    this.add(this.fundoPontos);
    this.add(this.textoPontos);

    this.posicionarEDesenharPlacar(this.textoPontos, this.fundoPontos, true);
  }

  private criarPlacarNome(): void {
    this.textoNome = this.cena.add
      .text(0, 0, this._nomeJogador, {
        fontFamily: '"Jersey 10"',
        fontSize: this.TEXTO_FONT_SIZE,
        color: this.TEXTO_COLOR,
      })
      .setOrigin(0.5);

    this.fundoNome = this.cena.add.graphics();
    this.add(this.fundoNome);
    this.add(this.textoNome);

    this.posicionarEDesenharPlacar(this.textoNome, this.fundoNome, false);
  }

  private posicionarEDesenharPlacar(
    textoObjeto: GameObjects.Text,
    fundoObjeto: GameObjects.Graphics,
    ehSuperior: boolean,
  ): void {
    fundoObjeto.clear();

    const offsetY = this.OFFSET_VERTICAL_PLACAR * (ehSuperior ? -1 : 1);
    const yTexto = offsetY;

    textoObjeto.setPosition(0, yTexto);

    const larguraConteudo = textoObjeto.width;
    const alturaConteudo = textoObjeto.height;

    const larguraFundo = larguraConteudo + 2 * this.PADDING_TEXTO_X;
    const alturaFundo = alturaConteudo + 2 * this.PADDING_TEXTO_Y;

    const xFundo = -larguraFundo / 2;
    const yFundo = yTexto - alturaFundo / 2;

    fundoObjeto.fillStyle(this.FUNDO_COR, this.FUNDO_ALPHA);
    fundoObjeto.fillRoundedRect(
      xFundo,
      yFundo,
      larguraFundo,
      alturaFundo,
      this.FUNDO_RAIO_BORDA,
    );

    fundoObjeto.lineStyle(
      this.BORDA_AVATAR_ESPESSURA,
      this.BORDA_AVATAR_COR,
      this.BORDA_AVATAR_ALPHA,
    );
    fundoObjeto.strokeRoundedRect(
      xFundo,
      yFundo,
      larguraFundo,
      alturaFundo,
      this.FUNDO_RAIO_BORDA,
    );
  }

  private aoRedimensionarTela(gameSize: Phaser.Structs.Size): void {
    this.desenharAvatarFundo();
    this.posicionarEDesenharPlacar(
      this.textoPontos,
      this.fundoPontos,
      this.getOrdemPontos(),
    );
    this.posicionarEDesenharPlacar(
      this.textoNome,
      this.fundoNome,
      this.getOrdemNome(),
    );
  }

  private getOrdemPontos(): boolean {
    return this._inverterOrdem ? false : true;
  }

  private getOrdemNome(): boolean {
    return this._inverterOrdem ? true : false;
  }

  public setPontuacao(novaPontuacao: number): void {
    this._pontuacao = novaPontuacao;
    this.textoPontos.setText(`Pontos: ${this._pontuacao}`);
    this.posicionarEDesenharPlacar(
      this.textoPontos,
      this.fundoPontos,
      this.getOrdemPontos(),
    );
  }

  public incrementarPontuacao(valor: number = 1): void {
    this.setPontuacao(this._pontuacao + valor);
  }

  public setNomeJogador(novoNome: string): void {
    this._nomeJogador = novoNome;
    this.textoNome.setText(this._nomeJogador);
    this.posicionarEDesenharPlacar(
      this.textoNome,
      this.fundoNome,
      this.getOrdemNome(),
    );
  }

  public setInverterOrdem(inverter: boolean): void {
    this._inverterOrdem = inverter;
    this.posicionarEDesenharPlacar(
      this.textoPontos,
      this.fundoPontos,
      this.getOrdemPontos(),
    );
    this.posicionarEDesenharPlacar(
      this.textoNome,
      this.fundoNome,
      this.getOrdemNome(),
    );
  }

  public destruir(): void {
    this.cena.scale.off(
      Phaser.Scale.Events.RESIZE,
      this.aoRedimensionarTela,
      this,
    );
    this.destroy();
  }
}
