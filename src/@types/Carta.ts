export interface DadosCarta {
  id: number;
  partida_id: number;
  jogador_partida_id?: number;
  valor: number;
  tipo: TipoCarta;
  posicao: number;
}

export enum TipoCarta {
  mao = 'mao',
  mesa = 'mesa',
  baralho = 'baralho',
  capturado = 'capturado',
}
