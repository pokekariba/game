import React, { useEffect, useState } from 'react';
import Button from '../../../../components/Button';
import { useLojaStore } from '../../../../store/useLojaStore';
import { StoreService } from '../../../../services/store.service';
import { useGameStore } from '../../../../store/useGameStore';

const BackgroundStore: React.FC = () => {
  const fundos = useLojaStore((s) => s.fundo);
  const usuario = useGameStore((g) => g.usuario);
  const setUsuario = useGameStore((g) => g.setUsuario);
  const [imagensFundos, setImagensFundos] = useState<string[][]>([]);
  const [fundoVisivel, setFundoVisivel] = useState<number>(0);

  useEffect(() => {
    if (fundos.length === 0 && imagensFundos) return;
    const buscarImagensFundos = async () => {
      const imagensFundos = await StoreService.listarImagemItens(fundos);
      setImagensFundos(imagensFundos);
    };
    buscarImagensFundos();
  }, [fundos]);

  const comprarItem = async (id: number) => {
    const response = await StoreService.comprarItemLoja(id);
    fundos[fundoVisivel].obtido = true;
    if (usuario) {
      setUsuario({
        ...usuario,
        moedas: response.saldoAtual,
      });
    }
  };

  const equiparFundo = async (id: number) => {
    const response = await StoreService.equiparItem(id);
    if (usuario && response) {
      setUsuario({
        ...usuario,
        fundoAtivo: id,
      });
    }
  };

  return (
    fundos.length &&
    imagensFundos.length && (
      <div className="store__background-wrapper">
        <div className="store__pokesnap__buttons d-flex gap-1 justify-center flex-wrap mx-5">
          {!fundos[fundoVisivel].obtido ? (
            <Button
              className="store__pokesnap__button store__pokesnap__button--buy d-flex align-center justify-center"
              onClick={() => comprarItem(fundos[fundoVisivel].id)}
            >
              {fundos[fundoVisivel].preco} moedas
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
            className={`store__pokesnap__button equipped d-flex align-center justify-center ${
              usuario?.fundoAtivo === fundos[fundoVisivel].id
                ? 'store__pokesnap__button--equipped'
                : 'store__pokesnap__button--not-equipped'
            }`}
            onClick={() => equiparFundo(fundos[fundoVisivel].id)}
            disabled={!fundos[fundoVisivel].obtido}
          >
            {usuario?.fundoAtivo === fundos[fundoVisivel].id
              ? 'Equipado'
              : 'Equipar'}
          </Button>
        </div>
        <div className="store__carrossel__item__active">
          <img
            src={imagensFundos[fundoVisivel][0]}
            alt={fundos[fundoVisivel].nome}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="store__carrossel__scroll">
          {fundos.map((f, idx) => (
            <div
              key={f.id}
              className={`store__carrossel__item store__carrossel__item--clickable ${
                idx === fundoVisivel ? 'store__carrossel__item--active' : ''
              }`}
              onClick={() => setFundoVisivel(idx)}
            >
              <h2 className="store__carrossel__item-title text-center mb-1">
                {f.nome}
              </h2>
              <img src={imagensFundos[idx][0]} alt={f.nome} />
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default BackgroundStore;
