import { Carta } from './Carta';

export default interface DadosPartida {
  rodada: number;
  tabuleiro: Carta[][];
  jogadaAdversario?: Carta[];
  pontuacaoJogador: number;
  pontuacaoAdversario: number;
  cartasCapturadas: number[];
  cartasCapturadasAdversario: number[];
  baralho: number;
  maoJogador: Carta[];
  maoAdversario: number;
  suaVez: boolean;
}
