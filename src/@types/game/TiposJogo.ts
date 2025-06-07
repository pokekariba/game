export enum TipoElemento {
  NORMAL = 'normal',
  METAL = 'metal',
  LUTADOR = 'lutador',
  PSIQUICO = 'psiquico',
  SOMBRIO = 'sombrio',
  GRAMA = 'grama',
  AGUA = 'agua',
  FOGO = 'fogo',
  ELETRICO = 'eletrico',
}

export const TiposPorIndice: TipoElemento[] = [
  TipoElemento.NORMAL,
  TipoElemento.METAL,
  TipoElemento.LUTADOR,
  TipoElemento.PSIQUICO,
  TipoElemento.SOMBRIO,
  TipoElemento.GRAMA,
  TipoElemento.AGUA,
  TipoElemento.FOGO,
  TipoElemento.ELETRICO,
];

export const MapeamentoIconesTipos = new Map<TipoElemento, string>([
  [TipoElemento.NORMAL, 'tipo0'],
  [TipoElemento.METAL, 'tipo1'],
  [TipoElemento.LUTADOR, 'tipo2'],
  [TipoElemento.PSIQUICO, 'tipo3'],
  [TipoElemento.SOMBRIO, 'tipo4'],
  [TipoElemento.GRAMA, 'tipo5'],
  [TipoElemento.AGUA, 'tipo6'],
  [TipoElemento.FOGO, 'tipo7'],
  [TipoElemento.ELETRICO, 'tipo8'],
]);
