import React, { useEffect, useState } from 'react';
import header from '../../../../assets/img/headerdecks.svg';
import Button from '../../../../components/Button';
import { useLojaStore } from '../../../../store/useLojaStore';
import { StoreService } from '../../../../services/store.service';
import { TipoItemLoja } from '../../../../@types/Item';
import { useGameStore } from '../../../../store/useGameStore';

const DeckStore: React.FC = () => {
  const cartas = useLojaStore((s) => s.cartas);
  const usuario = useGameStore((g) => g.usuario);
  const [imagensCartas, setImagensCartas] = useState<string[][]>();
  const [cartaVisivel, setCartaVisivel] = useState<number>(0);

  useEffect(() => {
    if (cartas.length === 0 && imagensCartas) return;
    const buscarImagensItens = async () => {
      const imagensCartas = await StoreService.listarImagemItens(cartas);
      setImagensCartas(imagensCartas);
    }
    buscarImagensItens();
  }, [cartas]);
  
  const comprarItem = async (id: number) => {
      const response = await StoreService.comprarItemLoja(id);
      if (usuario){
        useGameStore((g) => g.setUsuario)({...usuario, moedas: response.saldoAtual})
      }
  };

  const selecionarItem = async (id: number) =>{
    const response = await StoreService.equiparItem(id, TipoItemLoja.deck);
      if (usuario && response){
        useGameStore((g) => g.setUsuario)({...usuario, baralhoAtivo: response.itemAtivo})
      };
  }


  return imagensCartas && (
    <div className="d-flex mx-5 px-5">
      <img src={header} alt="header" className="store__header" />

      <div className="store_scrollbar d-flex flex-column align-center gap-5">
        <div className="store_scroll_container d-flex flex-column justify-center">
          {cartas.map((carta, idx) => (
            <div className="__store__card d-flex flex-column align-center" key={idx}>
              <h1 className="store__text fs-5 text-white d-flex justify-center">{carta.nome}</h1>

              {carta.obtido?(
                <Button
                  className={`mb-5 d-flex justify-center store__button ${
                    usuario?.baralhoAtivo === carta.id ? 'store__button--active' : ''
                  }`}
                  onClick={() => selecionarItem(carta.id)}
                >
                  {usuario?.baralhoAtivo === carta.id ?  'Selecionado' : 'Selecionar'}
                </Button>
              ) : (
                <Button
                  className="mb-5 d-flex justify-center store__button store__button--buy"
                  onClick={() => comprarItem(carta.id)}
                >
                  Comprar
                </Button>
              )}

              <div onClick={() => setCartaVisivel(idx)} className="store__card__thumb mb-5">
                {imagensCartas[idx].slice(0, 3).map((url, i) => (
                  <img loading="eager" fetchPriority="high" decoding="async" key={i} src={url} alt={`Carta thumb ${i + 1}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="store__deck-grid gap-2">
        { 
          imagensCartas[cartaVisivel].map((item, i) => (
            <img
              key={i}
              src={item}
              alt={`imagem carta de valor ${i}`}
              className="store__card"
            />
          ))}
      </div>
    </div>
  );
};

export default DeckStore;