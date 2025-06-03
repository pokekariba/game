export interface Carta {
  id: number;
  partida_id: number;
  jogador_partida_id?: number;
  valor: number;
  tipo: TipoCarta;
  posicao: number;
}

export enum TipoCarta {
  mao,
  mesa,
  baralho,
  capturado,
}
