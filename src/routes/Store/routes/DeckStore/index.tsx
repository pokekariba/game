import React, { useEffect, useState } from 'react';
import header from "../../../../assets/img/headerdecks.svg";
import Button from '../../../../components/Button';
import { useLojaStore } from '../../../../store/useLojaStore';
import { DisponibilidadeItem, TipoItemLoja, ItemLoja } from '../../../../@types/Item';
import { StoreService } from '../../../../services/store.service';

const DeckStore: React.FC = () => {
  const cartas = useLojaStore((state) => state.cartas);
  const updateItem = useLojaStore((state) => state.updateItem);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

 
  useEffect(() => {
    async function carregarDecks() {
      try {
        await StoreService.listaItensLoja();
      } catch (error) {
        console.error("Erro ao carregar decks:", error);
      }
    }
    carregarDecks();
  }, []);


  const cartasDecks = cartas.filter(item => item.tipo === TipoItemLoja.deck);

  
  const decks: ItemLoja[][] = [];
  for (let i = 0; i < cartasDecks.length; i += 3) {
    decks.push(cartasDecks.slice(i, i + 3));
  }

  const handleSelect = (index: number) => {
    const grupo = decks[index];
    if (grupo.every(carta => carta.obtido)) {
      setSelectedIndex(index);
    }
  };

  const handleBuy = (index: number) => {
    const grupo = decks[index];
    grupo.forEach((item) => {
      if (!item.obtido && item.disponibilidade === DisponibilidadeItem.disponivel) {
        updateItem({ ...item, obtido: true });
      }
    });
  };

  if (cartas.length === 0) {
    return <div className="text-white mx-auto">Carregando decks...</div>;
  }

  return (
    <div className='d-flex mx-5 px-5'>
      <img src={header} alt='header' className='store__header' />

      <div className='store_scrollbar d-flex flex-column align-center gap-5'>
        <div className='store_scroll_container d-flex flex-column justify-center'>
          {decks.map((grupo, index) => {
            const obtido = grupo.every(carta => carta.obtido);
            return (
              <div className='__store__card d-flex flex-column align-center' key={index}>
                <h1 className='store__text fs-5 text-white d-flex justify-center'>Deck {index + 1}</h1>

                {obtido ? (
                  <Button
                    className={`mb-5 d-flex justify-center store__button ${
                      selectedIndex === index ? 'store__button--active' : ''
                    }`}
                    onClick={() => handleSelect(index)}
                  >
                    {selectedIndex === index ? 'Selecionado' : 'Selecionar'}
                  </Button>
                ) : (
                  <Button
                    className="mb-5 d-flex justify-center store__button store__button--buy"
                    onClick={() => handleBuy(index)}
                  >
                    Comprar
                  </Button>
                )}

                <div className='store__card__thumb mb-5'>
                  {grupo.map((item, i) => (
                    <img key={i} src={item.nome} alt={`Carta ${item.id}`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="store__deck-grid gap-2">
        {selectedIndex !== null &&
          decks[selectedIndex].map((item, index) => (
            <img key={index} src={item.nome} alt={`Carta ${item.id}`} className="store__card" />
          ))}
      </div>
    </div>
  );
};

export default DeckStore;