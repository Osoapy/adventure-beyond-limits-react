import './pokemonButton.scss';
import { useEffect, useState } from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function PokemonButton({ onClick, pokemon }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: pokemon.id,
    });

    const [spriteUrl, setSpriteUrl] = useState("");
    const [typeClass, setTypeClass] = useState("normal");

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    useEffect(() => {
        async function fetchPokemonData() {
            if (!pokemon || !pokemon.species) return;

            const species = String(pokemon.species).toLowerCase().trim();

            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${species}`);
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
            ref={setNodeRef}
            style={style}
            className={`pokemonTeam ${typeClass}`}
            onClick={onClick}
            {...attributes}
            {...listeners}
        >
            {spriteUrl && (
                <img 
                    className="pokemonTeamImage" 
                    src={spriteUrl} 
                    alt={pokemon?.species || "Pokémon"} 
                    draggable="false"
                />
            )}
        </button>
    );
}