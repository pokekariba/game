import React, { useEffect, useState } from 'react';

import Button from '../../../../components/Button';
import { useLojaStore } from '../../../../store/useLojaStore';
import { useGameStore } from '../../../../store/useGameStore';
import { StoreService } from '../../../../services/store.service';

const AvatarStore: React.FC = () => {
  const avatares = useLojaStore((s) => s.avatar);
  const usuario = useGameStore((g) => g.usuario);

  const [imagensAvatares, setImagensAvatares] = useState<string[][]>([]);
  const [avatarVisivel, setAvatarVisivel] = useState<number>(0);
  const setUsuario = useGameStore((g) => g.setUsuario);

  useEffect(() => {
    if (avatares.length === 0) return;

    (async () => {
      const imgs = await StoreService.listarImagemItens(avatares); // [[url]]
      setImagensAvatares(imgs);
    })();
  }, [avatares]);

  const comprarItem = async (id: number) => {
    const res = await StoreService.comprarItemLoja(id);
    if (res.saldoAtual) {
      avatares[avatarVisivel].obtido = true;
    }
    if (usuario) setUsuario({ ...usuario, moedas: res.saldoAtual });
  };

  const equiparItem = async (id: number, variante: number) => {
    const res = await StoreService.equiparItem(id, variante);
    if (usuario && res)
      setUsuario({ ...usuario, avatarAtivo: id, avatarVariante: variante });
  };

  if (avatares.length === 0 || imagensAvatares.length === 0)
    return <div className="store__loading">Carregando avatares…</div>;

  return (
    <div className="store__pokealgo d-flex mx-5">
      <div className="store_scrollbar_avatar d-flex flex-column align-center gap-5">
        {avatares.map((avatar, idx) => (
          <div
            key={avatar.id}
            className="__store__avatar d-flex flex-column align-center"
          >
            <h1 className="store__text fs-5 text-white d-flex justify-center">
              {avatar.nome}
            </h1>

            {avatar.obtido ? (
              <Button
                className={`mb-3 d-flex justify-center ${
                  usuario?.avatarAtivo === avatar.id
                    ? 'store__button--active'
                    : ''
                }`}
                disabled
              >
                já obtido
              </Button>
            ) : (
              <Button
                className="mb-3 d-flex justify-center"
                onClick={() => comprarItem(avatar.id)}
              >
                {avatar.preco} moedas
              </Button>
            )}

            <div
              onClick={() => setAvatarVisivel(idx)}
              className="store__card__thumb__avatar mb-5"
            >
              <img
                src={imagensAvatares[idx]?.[0] ?? ''}
                alt={avatar.nome}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="store__avatar-grid">
        {(imagensAvatares[avatarVisivel] ?? []).map((imgUrl, idx) => (
          <img
            key={idx}
            src={imgUrl}
            alt={`${avatares[avatarVisivel]?.nome} avatar ${idx + 1}`}
            className="store__card__avatar"
            onClick={() => equiparItem(avatares[avatarVisivel].id, idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default AvatarStore;
