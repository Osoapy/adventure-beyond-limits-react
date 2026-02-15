import React, { useState, useEffect } from 'react';
import needSwitch from '../../functions/needSwitch/needSwitch';

export default function PokemonGif({ specie }) {
  const [gifUrl, setGifUrl] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const buscarGif = async () => {
      try {
        console.log(`species: ${specie}`);
        let urlOfFetch = `https://pokeapi.co/api/v2/pokemon/${specie.toLowerCase()}`;
        urlOfFetch = needSwitch(specie);
        const resposta = await fetch(urlOfFetch);
        if (!resposta.ok) throw new Error('Pokémon não encontrado');
        const dados = await resposta.json();
        const id = dados.id;
        const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
        setGifUrl(url);
        setErro(false);
      } catch (err) {
        setGifUrl(null);
        setErro(true);
      }
    };

    buscarGif();
  }, [specie]);

  if (erro) return <p>Pokémon não encontrado.</p>;
  if (!gifUrl) return <p>Carregando...</p>;

  return <img src={gifUrl} className='pokemon-sprite' alt={`Gif animado de ${specie}`} />;
};
