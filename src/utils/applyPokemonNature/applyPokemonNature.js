export default function ApplyPokemonNature(pokemon, value, multiplier) {
    const attributeDictionary = ['HP', 'Attack', 'Defense', 'S.Atk', 'S.Def', 'Speed']
    switch(value) {
        case 2:
            pokemon.attributes[attributeDictionary[1]] = Math.floor(pokemon.attributes[attributeDictionary[1]] * multiplier);
            break;
        case 3:
            pokemon.attributes[attributeDictionary[2]] = Math.floor(pokemon.attributes[attributeDictionary[2]] * multiplier);
            break;
        case 4:
            pokemon.attributes[attributeDictionary[3]] = Math.floor(pokemon.attributes[attributeDictionary[3]] * multiplier);
            break;
        case 5:
            pokemon.attributes[attributeDictionary[4]] = Math.floor(pokemon.attributes[attributeDictionary[4]] * multiplier);
            break;
        case 6:
            pokemon.attributes[attributeDictionary[5]] = Math.floor(pokemon.attributes[attributeDictionary[5]] * multiplier);
            break;
    }
}