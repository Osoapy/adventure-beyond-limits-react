import './pokemonTeam.css';

export default function PokemonTeam({ children }) {
    return(
        <div className="pokemonTeam-Container">
            { children }
        </div>
    );
}