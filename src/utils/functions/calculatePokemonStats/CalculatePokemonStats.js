import ApplyPokemonNature from "../applyPokemonNature/ApplyPokemonNature";
import GetNatureEffect from "../getNatureEffect/GetNatureEffect";

export default async function CalculatePokemonStats(pokemon) {
    // Buscar os base stats a partir da species na API
    const attributeDictionary = ['HP', 'Attack', 'Defense', 'S.Atk', 'S.Def', 'Speed']
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.species.toLowerCase()}`);
    const data = await response.json();
    const baseStats = data.stats.map(stat => stat.base_stat); // ordem: HP, Atk, Def, Sp.Atk, Sp.Def, Speed

    console.log(pokemon)
    console.log("BASE:", baseStats)
    console.log("IVS:", pokemon.ivs)
    console.log("EVS:", pokemon.evs)
    console.log("LEVEL:", pokemon.level)

    // HP CALCULATOR
    pokemon.attributes = {
        'HP' : 0, 
        'Attack' : 0, 
        'Defense' : 0, 
        'S.Atk' : 0, 
        'S.Def' : 0, 
        'Speed' : 0
    };
    pokemon.attributes[attributeDictionary[0]] = Number(pokemon.ivs[attributeDictionary[0]]) + (Number(pokemon.evs[attributeDictionary[0]]) / 4);
    pokemon.attributes[attributeDictionary[0]] += 2 * Number(baseStats[0]);
    pokemon.attributes[attributeDictionary[0]] = Math.floor(pokemon.attributes[attributeDictionary[0]] * Number(pokemon.level) / 100);
    pokemon.attributes[attributeDictionary[0]] += 10 + Number(pokemon.level);

    // SHEDINJA CASO ESPECIAL
    if (pokemon.species.toLowerCase() === "shedinja") {
        pokemon.attributes[attributeDictionary[0]] = 1;
    }

    // OTHER ATTRIBUTES
    for (let i = 1; i < 6; i++) {
        pokemon.attributes[attributeDictionary[i]] = Number(pokemon.ivs[attributeDictionary[i]]) + (Number(pokemon.evs[attributeDictionary[i]]) / 4);
        pokemon.attributes[attributeDictionary[i]] += 2 * Number(baseStats[i]);
        pokemon.attributes[attributeDictionary[i]] = Math.floor(pokemon.attributes[attributeDictionary[i]] * Number(pokemon.level) / 100);
        pokemon.attributes[attributeDictionary[i]] += 5;
    }

    // APLICANDO A NATUREZA
    ApplyPokemonNature(pokemon, GetNatureEffect(pokemon.nature)[0], 1.1);
    ApplyPokemonNature(pokemon, GetNatureEffect(pokemon.nature)[1], 0.9);
}