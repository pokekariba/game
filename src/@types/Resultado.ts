export default interface Resultado {
  vencedor: string;
  pontuacao: [string, number][];
  pontuacaoMap: Map<string, number>;
  motivo: MotivoFinal;
}

export enum MotivoFinal {
  NORMAL = 'normal',
  DESISTENCIA = 'desitencia',
  ERRO_SERVICOR = 'erro_servidor',
}
