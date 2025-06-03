export default interface Resultado {
  vencedor: string;
  pontuacao: Map<string, number>;
  motivo: MotivoFinal;
}

export enum MotivoFinal {
  NORMAL = 'normal',
  DESISTENCIA = 'desitencia',
  ERRO_SERVICOR = 'erro_servidor',
}
