import handleSpecificSpecies from '../../../utils/handleSpecificSpecies/handleSpecificSpecies';
import styles from './openPokemonButton.module.scss';
import { useEffect, useState } from "react";

export default function OpenPokemonButton({ onClick, pokemon }) {
    const [spriteUrl, setSpriteUrl] = useState("");
    const [typeClass, setTypeClass] = useState("normal");

    useEffect(() => {
        async function fetchPokemonData() {
            if (!pokemon || !pokemon.species) return;

            const species = String(pokemon.species).toLowerCase().trim();

            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${handleSpecificSpecies(species, 'sprite')}`);
                const data = await res.json();

                const sprite = data.sprites.other.home.front_default;
                const firstType = data.types?.[0]?.type?.name || "normal";

                setSpriteUrl(sprite);
                setTypeClass(firstType);
            } catch (err) {
                console.error("Erro ao buscar dados do Pokémon:", err);
                setSpriteUrl("https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg");
                setTypeClass("normal");
            }
        }

        fetchPokemonData();
    }, [pokemon]);

    return (
        <button
            className={styles["pokemonTeam"] + " " + styles[typeClass]}
            onClick={onClick}
        >
            {spriteUrl && (
                <img 
                    className={styles["pokemonTeamImage"]} 
                    src={spriteUrl} 
                    alt={pokemon?.species || "Pokémon"}
                />
            )}
        </button>
    );
}