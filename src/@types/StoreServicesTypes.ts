import { ItemLoja } from "./Item";

export interface ListaItensLojaResponse{
    cartas: ItemLoja[],
    fundo: ItemLoja[],
    avatar: ItemLoja[],
}