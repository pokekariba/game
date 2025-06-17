import React from 'react';

interface PlacarProps {
  pontuacao: number[];
  inverter?: boolean;
}

const Placar: React.FC<PlacarProps> = ({
  pontuacao = Array(9).fill(0),
  inverter,
}) => {
  return (
    <ul
      className={`d-flex gap-3 flex-column phaser-ui__placar__container ${inverter ? 'ml-auto flex-wrap-reverse' : 'flex-wrap'}`}
    >
      {pontuacao.map((ponto, index) => (
        <li
          className={`phaser-ui__placar ${inverter ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <img
            src={`/assets/tipos/tipo${index}.webp`}
            className="phaser-ui__placar__icone"
          />
          <p className="phaser-ui__placar__ponto">{ponto}</p>
        </li>
      ))}
    </ul>
  );
};

export default Placar;
