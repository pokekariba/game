import React from 'react';
import StartGame from '../../game/main';

const PhaserCanvas: React.FC = () => {
  const gameRef = React.useRef<Phaser.Game | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      gameRef.current = StartGame(containerRef.current);
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef}></div>;
};

export default PhaserCanvas;
