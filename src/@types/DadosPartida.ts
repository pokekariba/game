import { DadosCarta } from './Carta';

export default interface DadosPartida {
  rodada: number;
  tabuleiro: DadosCarta[][];
  jogadaAdversario?: DadosCarta[];
  valorJogadaAdversario?: number;
  pontuacaoJogador: number;
  pontuacaoAdversario: number;
  cartasCapturadas: number[];
  cartasCapturadasAdversario: number[];
  baralho: number;
  maoJogador: DadosCarta[];
  maoAdversario: number;
  suaVez: boolean;
}
