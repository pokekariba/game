import { useGameStore } from './../../store/useGameStore';
import { Scene, GameObjects } from 'phaser';
import { Tabuleiro } from '../components/Tabuleiro';
import { TipoTabuleiro } from '../../@types/game/TipoTabuleiroEnum';
import { MaoUsuario } from '../components/MaoUsuario';
import DadosPartida from '../../@types/DadosPartida';
import { DadosCarta, TipoCarta } from '../../@types/Carta';
import { Carta } from '../components/Carta';
import { TiposPorIndice } from '../../@types/game/TiposJogo';
import { Placar } from '../components/Placar';
import { CartasRestantesUI } from '../../@types/game/UIElements';
import { PlacarJogador } from '../components/PlacarJogador';

export class Battle extends Scene {
  private fundo: GameObjects.Image;
  private tabuleiro: Tabuleiro;
  private maoUsuario: MaoUsuario;
  private dadosPatida: DadosPartida;
  private placarUsuario: Placar;
  private placarAdversario: Placar;
  private avatarUsuario: PlacarJogador;
  private avatarAdversario: PlacarJogador;
  private debugGraphics: Phaser.GameObjects.Graphics;
  private cartasRestantesUI: CartasRestantesUI;

  private dadosPatidaObservable: () => void;

  constructor() {
    super('Battle');
  }

  public init() {
    this.dadosPatida = useGameStore.getState().dadosPartida!;
    this.dadosPatidaObservable = useGameStore.subscribe((gameState) => {
      if (gameState.dadosPartida) {
        this.dadosPatida = gameState.dadosPartida;
      }
    });
  }

  public create() {
    console.log('Battle create');

    this.debugGraphics = this.add.graphics();
    this.input.enableDebug(this.debugGraphics);

    this.fundo = this.add.image(0, 0, 'fundo').setOrigin(0.5);
    this.redimencionarFundo();

    this.scale.on(Phaser.Scale.Events.RESIZE, this.redimencionarFundo, this);

    this.tabuleiro = new Tabuleiro(this, TipoTabuleiro.TABULEIRO);

    const mockMao: DadosCarta[] = [
      {
        id: 1,
        partida_id: 1,
        posicao: 0,
        jogador_partida_id: 1,
        tipo: TipoCarta.mao,
        valor: 1,
      },
      {
        id: 2,
        partida_id: 2,
        posicao: 1,
        jogador_partida_id: 1,
        tipo: TipoCarta.mao,
        valor: 2,
      },
      {
        id: 3,
        partida_id: 3,
        posicao: 2,
        jogador_partida_id: 1,
        tipo: TipoCarta.mao,
        valor: 3,
      },
      {
        id: 4,
        partida_id: 4,
        posicao: 3,
        jogador_partida_id: 1,
        tipo: TipoCarta.mao,
        valor: 4,
      },
      {
        id: 5,
        partida_id: 5,
        posicao: 4,
        jogador_partida_id: 1,
        tipo: TipoCarta.mao,
        valor: 0,
      },
    ];

    this.maoUsuario = new MaoUsuario(this, mockMao);

    const numerosIniciaisPlacar = new Array(TiposPorIndice.length).fill(0);

    this.placarUsuario = new Placar(this, 40, 120, numerosIniciaisPlacar);
    this.placarAdversario = new Placar(
      this,
      this.scale.width - 100,
      260,
      numerosIniciaisPlacar,
    );

    const xPos = this.scale.width / 2 - 360;
    const yPos = 80;
    const valorInicialCartas = 66;

    const texto = this.add
      .text(xPos, yPos, `Cartas Restantes: ${valorInicialCartas}`, {
        fontFamily: '"Jersey 10"',
        fontSize: '24px',
        color: '#000000',
      })
      .setOrigin(1, 0.55)
      .setDepth(200);

    const fundo = this.add.graphics();
    fundo.setDepth(199);

    this.cartasRestantesUI = {
      texto: texto,
      fundo: fundo,
      valor: valorInicialCartas,
    };

    this.desenharCartasRestantesFundo();

    this.avatarUsuario = new PlacarJogador(
      this,
      120,
      this.scale.height - 100,
      'avatarUsuario',
      'Jogador 1',
      0,
      false,
    );
    this.avatarAdversario = new PlacarJogador(
      this,
      this.scale.width - 120,
      100,
      'avatarAdversario',
      'Jogador 2',
      0,
      true,
    );

    this.events.on('carta_clicada', this.aoClicarNaCarta.bind(this));
  }

  private desenharCartasRestantesFundo(): void {
    this.cartasRestantesUI.fundo.clear();

    const larguraTexto = this.cartasRestantesUI.texto.width;
    const alturaTexto = this.cartasRestantesUI.texto.height;

    const paddingX = 25;
    const paddingY = 15;
    const raioBorda = 20;
    const corFundo = 0xffffff;
    const corBorda = 0xff8c00;
    const espessuraBorda = 3;

    const larguraFundo = larguraTexto + 2 * paddingX;
    const alturaFundo = alturaTexto + 2 * paddingY;

    const xFundo = this.cartasRestantesUI.texto.x - larguraFundo + paddingX;
    const yFundo = this.cartasRestantesUI.texto.y - alturaFundo / 2;

    this.cartasRestantesUI.fundo.lineStyle(espessuraBorda, corBorda, 1);
    this.cartasRestantesUI.fundo.strokeRoundedRect(
      xFundo,
      yFundo,
      larguraFundo,
      alturaFundo,
      raioBorda,
    );

    this.cartasRestantesUI.fundo.fillStyle(corFundo, 1);
    this.cartasRestantesUI.fundo.fillRoundedRect(
      xFundo,
      yFundo,
      larguraFundo,
      alturaFundo,
      raioBorda,
    );
  }

  public shutdown() {
    this.dadosPatidaObservable();
    if (this.tabuleiro) {
      this.tabuleiro.destroy();
    }
    if (this.maoUsuario) {
      this.maoUsuario.destruir();
    }
    this.scale.off(Phaser.Scale.Events.RESIZE, this.redimencionarFundo, this);
  }

  private aoClicarNaCarta(carta: Carta) {
    const dados = carta.getDadosCarta();
    console.log(
      `[Battle] Evento 'carta_clicada' recebido para carta: ${dados.valor} : ${dados.posicao} : ${dados.tipo}`,
    );
    if (this.maoUsuario.obterCartas().includes(carta)) {
      const cartaRemovida = this.maoUsuario.removerCarta(dados.id);
      if (cartaRemovida) {
        this.tabuleiro.jogarCarta(carta);
      }
    }
  }

  private redimencionarFundo() {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    this.fundo.setPosition(gameWidth / 2, gameHeight / 2);
    const scaleX = gameWidth / this.fundo.width;
    const scaleY = gameHeight / this.fundo.height;
    const scale = Math.max(scaleX, scaleY);
    this.fundo.setScale(scale);
  }
}
