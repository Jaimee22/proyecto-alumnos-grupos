import React from 'react';
import useSound from 'use-sound';
import Tambores from "../../assets/musica/tambores.mp3"

const Musica = () => {
  const [play] = useSound(Tambores, { volume: 10, soundEnabled: true });

  return (
    <div>
      <h1>Música</h1>
      <button onClick={play}>Reproducir Sonido</button>
    </div>
  );
};

export default Musica;
