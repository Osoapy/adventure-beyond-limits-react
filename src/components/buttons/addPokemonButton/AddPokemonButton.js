import '../pokemonButton/pokemonButton.scss';
import spriteUrl from '../../../assets/plusSymbol.png';

const AddPokemonButton = ({onClick}) => {
    return (
        <button 
            className={`pokemonTeam plusSymbolContainer`}
            onClick={() => {onClick()}}
        >
            <img 
                className="plusSymbol" 
                src={spriteUrl} 
                alt={"AddButton"} 
                draggable="false"
            />
            <img 
                className="fakePlusSymbol" 
                src={spriteUrl} 
                alt={"AddButton"} 
                draggable="false"
            />
        </button>
    );
}

export default AddPokemonButton;