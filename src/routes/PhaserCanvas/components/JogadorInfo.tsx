import React from 'react';

interface JogadorInfoProps {
  nome: string;
  pontos: number;
  avatar: string;
  inverter?: boolean;
}

const JogadorInfo: React.FC<JogadorInfoProps> = (props) => {
  return (
    <div
      className={`d-flex gap-2 align-items-center ${props.inverter ? 'flex-column-reverse' : 'flex-column'}`}
    >
      <div className="phaser-ui__avatar__container">
        <p>Pontos: {props.pontos}</p>
      </div>
      <img src={props.avatar} className="phaser-ui__avatar" />
      <div className="phaser-ui__avatar__container">
        <p>{props.nome}</p>
      </div>
    </div>
  );
};

export default JogadorInfo;
