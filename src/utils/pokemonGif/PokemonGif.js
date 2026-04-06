import { useState, useEffect } from 'react';
import styles from "./pokemonGif.module.scss";
import handleSpecificSpecies from '../handleSpecificSpecies/handleSpecificSpecies';

export default function PokemonGif({ specie, className }) {
  const [gifUrl, setGifUrl] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const buscarGif = async () => {
      try {
        console.log(`species: ${specie}`)
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${handleSpecificSpecies(specie.toLowerCase(), 'gif')}`);
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

  return <img src={gifUrl} className={className + ' ' + styles[specie.toLowerCase()]} alt={`Gif animado de ${specie}`} />;
};
