export interface ItemLoja{
      id: number,
      nome: string,
      tipo: TipoItemLoja,
      disponibilidade: DisponibilidadeItem,
      preco: number,
      obtido: boolean,
}

export enum TipoItemLoja {
  deck = "deck",
  avatar = "avatar",
  fundo = "fundo",
}

export enum DisponibilidadeItem {
  disponivel = "disponivel",
  indisponivel = "indisponivel"
}