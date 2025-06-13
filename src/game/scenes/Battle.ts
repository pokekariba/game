import { useGameStore } from './../../store/useGameStore';
import { Scene, GameObjects } from 'phaser';
import { Tabuleiro } from '../components/Tabuleiro';
import { TipoTabuleiro } from '../../@types/game/TipoTabuleiroEnum';
import { MaoUsuario } from '../components/MaoUsuario';
import DadosPartida from '../../@types/DadosPartida';
import { Carta } from '../components/Carta';
import { emitirEvento } from '../../services/partida.service';
import {
  SocketClientEventsData,
  SocketClientEventsEnum,
} from '../../@types/PartidaServiceTypes';

export class Battle extends Scene {
  private fundo: GameObjects.Image;
  private tabuleiro: Tabuleiro;
  private maoUsuario: MaoUsuario;
  private dadosPatida: DadosPartida;
  private debugGraphics: Phaser.GameObjects.Graphics;
  private cartasRodada: Carta[] = [];
  private valorCartaRodada: number = 0;
  private suaVez?: boolean = undefined;

  private dadosPatidaObservable: () => void;

  constructor() {
    super('Battle');
  }

  public init() {
    console.log('Battle init: ', useGameStore.getState());

    this.dadosPatida = useGameStore.getState().dadosPartida!;
    this.suaVez = this.dadosPatida.suaVez;
    this.emitirSuaVez();
    this.dadosPatidaObservable = useGameStore.subscribe(async (gameState) => {
      console.log('Observable: ', gameState);
      if (gameState.dadosPartida) {
        const dadosPartidaAntigos: DadosPartida = JSON.parse(
          JSON.stringify(this.dadosPatida),
        );
        const novaRodada =
          this.dadosPatida.rodada !== gameState.dadosPartida.rodada;
        this.dadosPatida = gameState.dadosPartida;

        if (novaRodada) {
          await this.montarJogada(dadosPartidaAntigos);
          this.suaVez = gameState.dadosPartida.suaVez;
          this.emitirSuaVez();
        }
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

    window.addEventListener(
      'trocar_tabuleiro',
      this.trocarTipoTabuleiro.bind(this),
    );

    window.addEventListener(
      'finalizar_rodada',
      this.finalizarRodada.bind(this),
    );

    this.maoUsuario = new MaoUsuario(this, this.dadosPatida.maoJogador);

    this.events.on('carta_clicada', this.aoClicarNaCarta.bind(this));

    this.events.on('carta_coringa_jogada', this.aoJogarCoringa.bind(this));
  }

  public shutdown() {
    this.dadosPatidaObservable();
    if (this.tabuleiro) {
      this.tabuleiro.destroy();
    }
    if (this.maoUsuario) {
      this.maoUsuario.destroy();
    }
    window.removeEventListener(
      'trocar_tabuleiro',
      this.trocarTipoTabuleiro.bind(this),
    );
    window.removeEventListener(
      'finalizar_rodada',
      this.finalizarRodada.bind(this),
    );
    this.scale.off(Phaser.Scale.Events.RESIZE, this.redimencionarFundo, this);
  }

  private trocarTipoTabuleiro(event: Event) {
    const novoTipoTabuleiro: TipoTabuleiro = (event as CustomEvent).detail;
    this.tabuleiro.trocarImagem(novoTipoTabuleiro);
  }

  private finalizarRodada() {
    const idCartas = this.cartasRodada[0]
      ? this.cartasRodada.map((carta) => carta.getDadosCarta().id)
      : [];
    const idPartida = useGameStore.getState().partidaSelecionada?.id || 0;
    const jogada: SocketClientEventsData[SocketClientEventsEnum.JOGADA] = {
      idCartas,
      idPartida,
      valorCamaleao: this.valorCartaRodada,
    };
    emitirEvento(SocketClientEventsEnum.JOGADA, null, false, jogada);
    this.suaVez = undefined;
    this.emitirSuaVez();
    this.cartasRodada = [];
    this.valorCartaRodada = 0;
  }

  private aoJogarCoringa(valorCoringa: number) {
    if (!this.valorCartaRodada) {
      this.valorCartaRodada = valorCoringa;
    }
  }

  private async aoClicarNaCarta(carta: Carta) {
    const dados = carta.getDadosCarta();
    if (!this.suaVez) return;
    if (this.cartasRodada.length) {
      if (dados.valor !== this.valorCartaRodada && dados.valor) return;
    } else {
      this.valorCartaRodada = dados.valor;
    }
    this.cartasRodada.push(carta);
    if (this.maoUsuario.obterCartas().includes(carta)) {
      const cartaRemovida = this.maoUsuario.removerCarta(dados.id);
      if (cartaRemovida) {
        await this.tabuleiro.jogarCarta(carta, this.valorCartaRodada);
      }
    }
  }

  private async montarJogada(dadosPartidaAntigos: DadosPartida) {
    const tabuleiroAtual = this.tabuleiro.getCartasTabuleiro();
    const tabuleiroCalculado = this.dadosPatida.tabuleiro;
    const maoJogador = this.maoUsuario.obterCartas();

    if (this.dadosPatida.jogadaAdversario) {
      const tamanhoCarta = maoJogador[0]
        ? maoJogador[0].displayHeight
        : this.scale.height / 2;
      for (const carta of this.dadosPatida.jogadaAdversario) {
        const objCarta = new Carta(
          this,
          this.scale.width / 2,
          -tamanhoCarta,
          carta,
          false,
        );
        await this.tabuleiro.jogarCarta(
          objCarta,
          this.dadosPatida.valorLogadaAdversario,
        );
      }
    }

    for (const [index, setor] of tabuleiroCalculado.entries()) {
      const setorAtual = tabuleiroAtual[index];
      if (!setorAtual.length || setor.length) continue;
      const cartasRemovidas = this.tabuleiro.removerTodasCartasDoSetor(index);
      let yAnimacao = -cartasRemovidas[0].displayHeight;
      if (
        dadosPartidaAntigos.cartasCapturadas[index] <
        this.dadosPatida.cartasCapturadas[index]
      ) {
        yAnimacao = this.scale.height + cartasRemovidas[0].displayHeight;
      }

      for (const carta of cartasRemovidas) {
        await new Promise<void>((resolve) => {
          this.tweens.add({
            targets: carta,
            y: yAnimacao,
            rotation: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
              carta.destroy();
              resolve();
            },
          });
        });
      }
    }

    this.maoUsuario.atualizarCartas(this.dadosPatida.maoJogador);
  }

  private emitirSuaVez() {
    const event = new CustomEvent('sua_vez', {
      detail: this.suaVez,
    });
    window.dispatchEvent(event);
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
