import Jogador from './Jogadores';

export interface Partida {
  id: number;
  nome: string;
  vagas: number;
  senha: boolean;
}

export interface PartidaSelecionada extends Partida {
  donoPartida: boolean;
  jogadores?: Jogador[];
}
