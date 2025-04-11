import './pokemonButton.css';

export default function PokemonButton({ onClick }) {
    return (
        <button className="pokemonTeam steel" onClick={ onClick }>
            <img className="pokemonTeamImage" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/767.png"/>
        </button>
    );
}