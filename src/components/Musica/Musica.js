import React from 'react';
import useSound from 'use-sound';
import Tambores from "../../assets/musica/tambores.mp3";

const Musica = () => {
  const [play, { stop }] = useSound(Tambores, { volume: 1, soundEnabled: true });

  const reproducir = () => {
    stop(); // Detener la reproducción anterior si aún está en curso
    play();
  };

  return (
    <div>
      <h1>Música</h1>
      {/* No hay necesidad de un botón aquí */}
    </div>
  );
};

export default Musica;
