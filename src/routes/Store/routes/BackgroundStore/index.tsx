import React, { useEffect, useState } from 'react';
import Button from '../../../../components/Button';
import pokesnap from '../../../../assets/img/Pokesnap.svg';
import { ItemLoja } from '../../../../@types/Item';
import { StoreService } from '../../../../services/store.service';
import { useLojaStore } from '../../../../store/useLojaStore';

const BackgroundStore: React.FC = () => {
  const fundos = useLojaStore((state) => state.fundo); // ✔️ Pegando apenas fundos
  const [backgrounds, setBackgrounds] = useState<ItemLoja[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [equippedMenu, setEquippedMenu] = useState<number | null>(null);
  const [equippedBattle, setEquippedBattle] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const activeBackground: ItemLoja | undefined = backgrounds[activeIndex];

  useEffect(() => {
    const carregarBackgrounds = async () => {
      await StoreService.listaItensLoja();
      setLoading(false);
    };

    carregarBackgrounds();
  }, []);

  useEffect(() => {
    if (!Array.isArray(fundos) || fundos.length === 0) return;
    setBackgrounds(fundos);
  }, [fundos]);

  const handleBuy = async () => {
    if (!activeBackground || activeBackground.obtido) return;

    try {
      const response = await StoreService.comprarItemLoja(activeBackground.id);
      if (response?.sucesso) {
        setBackgrounds((prev) =>
          prev.map((bg) =>
            bg.id === activeBackground.id ? { ...bg, obtido: true } : bg
          )
        );
      }
    } catch (error) {
      console.error('Erro ao comprar background:', error);
    }
  };

  const handleEquip = async (tipo: 'menu' | 'batalha') => {
    if (!activeBackground?.obtido) return;

    try {
      const response = await StoreService.equiparBackground({
        id: activeBackground.id,
        tipo,
      });

      if (response?.sucesso) {
        if (tipo === 'menu') setEquippedMenu(activeBackground.id);
        else setEquippedBattle(activeBackground.id);
      }
    } catch (error) {
      console.error('Erro ao equipar background:', error);
    }
  };

  if (loading) {
    return <div className="store__loading">Carregando...</div>;
  }

  if (!backgrounds.length) {
    return <div className="store__empty">Nenhum background disponível.</div>;
  }

  return (
    <div className="store__background-wrapper">
      <div className="store__pokesnap__container">
        <img src={pokesnap} alt="header" className="store__pokesnap" />

        <div className="store__pokesnap__buttons d-flex gap-1 justify-center flex-wrap">
          {!activeBackground.obtido ? (
            <Button
              className="store__pokesnap__button store__pokesnap__button--buy d-flex align-center justify-center"
              onClick={handleBuy}
            >
              Comprar ({activeBackground.preco} moedas)
            </Button>
          ) : (
            <Button
              className="store__pokesnap__button store__pokesnap__button--obtained d-flex align-center justify-center"
              disabled
            >
              Já obtido
            </Button>
          )}

          <Button
            className={`store__pokesnap__button d-flex align-center justify-center mx-3 ${
              equippedMenu === activeBackground.id
                ? 'store__pokesnap__button--equipped'
                : 'store__pokesnap__button--not-equipped'
            }`}
            onClick={() => handleEquip('menu')}
            disabled={!activeBackground.obtido}
          >
            Equipar Menu
          </Button>

          <Button
            className={`store__pokesnap__button d-flex align-center justify-center ${
              equippedBattle === activeBackground.id
                ? 'store__pokesnap__button--equipped'
                : 'store__pokesnap__button--not-equipped'
            }`}
            onClick={() => handleEquip('batalha')}
            disabled={!activeBackground.obtido}
          >
            Equipar Batalha
          </Button>
        </div>
      </div>

      <div className="store__carrossel__item__active__wrapper">
        <div className="store__carrossel__item__active">
          <img
            src={activeBackground.imagem || activeBackground.nome}
            alt={`Background ${activeBackground.id}`}
          />
        </div>
      </div>

      <div className="store__carrossel__scroll">
        {backgrounds.map((bg, index) => (
          <div
            key={bg.id}
            className={`store__carrossel__item store__carrossel__item--clickable ${
              index === activeIndex ? 'store__carrossel__item--active' : ''
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <img src={bg.imagem || bg.nome} alt={`Background ${bg.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundStore;