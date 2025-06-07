import React, { useState, useEffect } from 'react';
import pokealgo from '../../../../assets/img/pokealgo.svg';
import { StoreService } from '../../../../services/store.service';
import { useLojaStore } from '../../../../store/useLojaStore';
import { ItemLoja, TipoItemLoja } from '../../../../@types/Item';

type AvatarGroupKey = 'ash' | 'misty' | 'brock' | 'gary';

const AvatarStore: React.FC = () => {
  const [avatarGroups, setAvatarGroups] = useState<Record<AvatarGroupKey, ItemLoja[]>>({
    ash: [],
    misty: [],
    brock: [],
    gary: [],
  });

  const [activeGroup, setActiveGroup] = useState<AvatarGroupKey>('ash');
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const { avatar } = useLojaStore();

  useEffect(() => {
    async function loadAvatars() {
      await StoreService.listaItensLoja(); // carrega os dados na store

      // separa os avatares por prefixo do nome (ex: 'ash_01')
      const grupos: Record<AvatarGroupKey, ItemLoja[]> = {
        ash: [],
        misty: [],
        brock: [],
        gary: [],
      };

      avatar
        .filter((item) => item.tipo === TipoItemLoja.avatar)
        .forEach((item) => {
          const key = Object.keys(grupos).find((k) => item.nome.toLowerCase().startsWith(k));
          if (key) {
            grupos[key as AvatarGroupKey].push(item);
          }
        });

      setAvatarGroups(grupos);
    }

    loadAvatars();
  }, [avatar]);

  const handleSelect = (index: number) => {
    setSelectedAvatar(index);
  };

  const groupNames = Object.keys(avatarGroups) as AvatarGroupKey[];
  const currentAvatars = avatarGroups[activeGroup] || [];

  return (
    <div className="d-flex flex-row gap-4 align-start justify-center store__avatar-layout">
      <img className="store__pokealgo" src={pokealgo} alt="Pokealgo logo" />
      <div className="d-flex flex-column align-center store__avatar-grid">
        <div className="store__grid-6">
          {currentAvatars.slice(0, 6).map((avatar, index) => (
            <div key={index} className="store__grid-avatar-wrapper">
              <div
                className={`store__grid-avatar${selectedAvatar === index ? ' store__grid-avatar--selected' : ''}`}
                onClick={() => handleSelect(index)}
              >
                <img src={avatar.nome} alt={`Avatar ${index + 1}`} />
              </div>
            </div>
          ))}
        </div>

        {currentAvatars[6] && (
          <div className="store__grid-avatar-wrapper">
            <div
              className={`store__grid-avatar store__grid-item--bottom${selectedAvatar === 6 ? ' store__grid-avatar--selected' : ''}`}
              onClick={() => handleSelect(6)}
            >
              <img src={currentAvatars[6].nome} alt="Avatar 7" />
            </div>
            <label className="store__checkbox-label">
              <input
                type="checkbox"
                checked={selectedAvatar === 6}
                onChange={() => handleSelect(6)}
                title="Selecionar Avatar 7"
              />
            </label>
          </div>
        )}
      </div>

      <div className="d-flex justify-center flex-column store__avatar-groups ">
        {groupNames.map((group, index) => (
          <div
            key={index}
            className={`d-flex align-center justify-center gap-2 store__avatar-group-rect${
              activeGroup === group ? ' store__avatar-group-rect--active' : ''
            }`}
            onClick={() => setActiveGroup(group)}
          >
            <span className="fs-3 store__avatar-group-label">{group}</span>
            {avatarGroups[group][0] && (
              <img src={avatarGroups[group][0].nome} alt={`${group} thumbnail`} className="store__avatar-group-img" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarStore;