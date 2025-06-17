import { ItemLoja } from "./Item";

export interface ListaItensLojaResponse{
    cartas: ItemLoja[],
    fundo: ItemLoja[],
    avatar: ItemLoja[],
}

export interface visualizarItemResponse {
    urlsItem: string[]
}