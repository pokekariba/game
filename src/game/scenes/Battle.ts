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
  private countdownText: Phaser.GameObjects.Text;
  private turnTimer: Phaser.Time.TimerEvent;
  private remainingTime: number;
  private boundFinalizarRodada: (event: Event) => void;
  private boundTrocarTipoTabuleiro: (event: Event) => void;

  private dadosPatidaObservable: () => void;

  constructor() {
    super('Battle');
  }

  public init() {
    console.log('Battle init: ', useGameStore.getState());

    this.dadosPatida = useGameStore.getState().dadosPartida!;
    this.suaVez = this.dadosPatida.suaVez;
    this.emitirSuaVez();
  }

  public create() {
    console.log('Battle create');

    this.debugGraphics = this.add.graphics();
    this.input.enableDebug(this.debugGraphics);

    this.fundo = this.add.image(0, 0, 'fundo').setOrigin(0.5);
    this.redimencionarFundo();

    this.scale.on(Phaser.Scale.Events.RESIZE, this.redimencionarFundo, this);

    this.tabuleiro = new Tabuleiro(this, TipoTabuleiro.TABULEIRO);

    this.boundTrocarTipoTabuleiro = this.trocarTipoTabuleiro.bind(this);
    window.addEventListener(
      'trocar_tabuleiro',
      this.trocarTipoTabuleiro.bind(this),
    );

    this.boundFinalizarRodada = this.finalizarRodada.bind(this);
    window.addEventListener('finalizar_rodada', this.boundFinalizarRodada);

    this.maoUsuario = new MaoUsuario(this, this.dadosPatida.maoJogador);

    if (this.suaVez) {
      this.iniciarTemporizadorDeTurno();
    }

    this.events.on('carta_clicada', this.aoClicarNaCarta.bind(this));

    this.events.on('carta_coringa_jogada', this.aoJogarCoringa.bind(this));

    this.events.on('tempo_esgotado', this.jogarPrimeiraCarta.bind(this));

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
          console.log('depois montarJogada');
          this.suaVez = gameState.dadosPartida.suaVez;
          if (this.suaVez) {
            this.iniciarTemporizadorDeTurno();
          }
          this.emitirSuaVez();
        }
      }
    });
  }

  public shutdown() {
    console.log('shutdown() da cena Battle executado!');
    this.dadosPatidaObservable();
    if (this.tabuleiro) {
      this.tabuleiro.destroy();
    }
    if (this.maoUsuario) {
      this.maoUsuario.destroy();
    }
    window.removeEventListener(
      'trocar_tabuleiro',
      this.boundTrocarTipoTabuleiro,
    );
    window.removeEventListener('finalizar_rodada', this.boundFinalizarRodada);
    this.scale.off(Phaser.Scale.Events.RESIZE, this.redimencionarFundo, this);
  }

  private trocarTipoTabuleiro(event: Event) {
    const novoTipoTabuleiro: TipoTabuleiro = (event as CustomEvent).detail;
    this.tabuleiro.trocarImagem(novoTipoTabuleiro);
  }

  private iniciarTemporizadorDeTurno() {
    if (this.turnTimer) this.turnTimer.destroy();
    if (this.countdownText) this.countdownText.destroy();

    this.remainingTime = 15;

    const centroDoTabuleiro = this.tabuleiro.getCentro();

    this.countdownText = this.add
      .text(centroDoTabuleiro.x, centroDoTabuleiro.y, `${this.remainingTime}`, {
        fontSize: '48px',
        fontFamily: '"Jersey 10"',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.turnTimer = this.time.addEvent({
      delay: 1000,
      callback: this.atualizarContador,
      callbackScope: this,
      repeat: this.remainingTime - 1,
    });
  }

  private atualizarContador() {
    this.remainingTime--;
    this.countdownText.setText(`${this.remainingTime}`);
    if (this.remainingTime <= 0) {
      this.events.emit('tempo_esgotado');
    }
  }

  private async jogarPrimeiraCarta() {
    const primeiraCarta = this.maoUsuario.obterCartas()[0];

    if (primeiraCarta && !this.cartasRodada.length) {
      await this.aoClicarNaCarta(
        primeiraCarta,
        primeiraCarta.getDadosCarta().valor || 1,
      );
    }
    this.finalizarRodada();
  }

  private finalizarRodada() {
    console.log('finalizarRodada listener');
    if (this.turnTimer) {
      this.turnTimer.destroy();
    }
    if (this.countdownText) {
      this.countdownText.destroy();
    }
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

  private async aoClicarNaCarta(carta: Carta, camaleao?: number) {
    const dados = carta.getDadosCarta();
    if (!this.suaVez) return;
    if (this.cartasRodada.length) {
      if (dados.valor !== this.valorCartaRodada && dados.valor) return;
    } else {
      this.valorCartaRodada = camaleao || dados.valor;
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
    const tamanhoCarta = maoJogador[0]
      ? maoJogador[0]?.displayHeight
      : this.scale.height / 2;

    await new Promise<void>((resolve) => {
      this.time.delayedCall(
        50,
        async () => {
          if (
            this.dadosPatida.jogadaAdversario &&
            this.dadosPatida.jogadaAdversario.length > 0
          ) {
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
                this.dadosPatida.valorJogadaAdversario,
              );
            }
          }
          resolve();
        },
        [],
        this,
      );
    });

    for (const [index, setor] of tabuleiroCalculado.entries()) {
      const setorAtual = tabuleiroAtual[index];
      if (!setorAtual.length || setor.length) continue;
      const cartasRemovidas = this.tabuleiro.removerTodasCartasDoSetor(index);
      let yAnimacao = -1080;
      if (
        dadosPartidaAntigos.cartasCapturadas[index] <
        this.dadosPatida.cartasCapturadas[index]
      ) {
        yAnimacao = this.scale.height + cartasRemovidas[0].displayHeight;
      }
      for (const carta of cartasRemovidas) {
        await new Promise<void>((resolve) => {
          console.log(this, carta);
          this.tweens.add({
            targets: carta,
            y: yAnimacao,
            rotation: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
              console.log('onComplete');
              carta.setVisible(false);
              resolve();
            },
          });
        });
      }
    }
    console.log('depois for cartasRemovidas');
    this.maoUsuario.atualizarCartas(this.dadosPatida.maoJogador);
  }

  private emitirSuaVez() {
    console.log('emitirSuaVez');
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
