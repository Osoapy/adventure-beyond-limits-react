const getGenderTrueName = (char) => {
    if (char === 'M') return "male";
    else if (char === 'F') return "female";
    else return null;
}

const getStatsTrueName = (stat) => {
    stat = stat.toLowerCase();
    if (stat === 'hp') return "HP";
    else if (stat === 'atk') return "Attack";
    else if (stat === 'def') return "Defense";
    else if (stat === 'spa') return "S.Atk";
    else if (stat === 'spd') return "S.Def";
    else if (stat === 'spe') return "Speed";
    else throw new Error("Stat desconhecida: " + stat);
}

const parseFirstLine = (line) => {
    line = line.trim();
    let match;

    // nickname + species + gender + heldItem
    match = line.match(/^(.+?) \(([^()]+)\) \((M|F)\) @ (.+)$/);
    if (match) return { nickname: match[1].trim(), species: match[2].trim(), gender: getGenderTrueName(match[3]), heldItem: match[4].trim().replace(' ', '-').toLowerCase() };

    // nickname + species + heldItem
    match = line.match(/^(.+?) \(([^()]+)\) @ (.+)$/);
    if (match) return { nickname: match[1].trim(), species: match[2].trim(), gender: null, heldItem: match[3].trim().replace(' ', '-').toLowerCase() };

    // nickname + species + gender
    match = line.match(/^(.+?) \(([^()]+)\) \((M|F)\)$/);
    if (match) return { nickname: match[1].trim(), species: match[2].trim(), gender: getGenderTrueName(match[3]), heldItem: null };

    // nickname + species
    match = line.match(/^(.+?) \(([^()]+)\)$/);
    if (match) return { nickname: match[1].trim(), species: match[2].trim(), gender: null, heldItem: null };

    // species + gender + heldItem
    match = line.match(/^([^()]+) \((M|F)\) @ (.+)$/);
    if (match) return { nickname: null, species: match[1].trim(), gender: getGenderTrueName(match[2]), heldItem: match[3].trim().replace(' ', '-').toLowerCase() };

    // species + gender
    match = line.match(/^([^()]+) \((M|F)\)$/);
    if (match) return { nickname: null, species: match[1].trim(), gender: getGenderTrueName(match[2]), heldItem: null };

    // species + heldItem
    match = line.match(/^([^()]+) @ (.+)$/);
    if (match) return { nickname: null, species: match[1].trim(), gender: null, heldItem: match[2].trim().replace(' ', '-').toLowerCase() };

    // species only
    match = line.match(/^([^()]+)$/);
    if (match) return { nickname: null, species: line.trim(), gender: null, heldItem: null };

    throw new Error("Linha inicial mal formatada: " + line);
};

const parseShowdownText = (text) => {
    const lines = text.trim().split('\n');
    const pokemons = [];
    let currentLines = [];

    const flushPokemon = () => {
        if (currentLines.length === 0) return;

        const firstLine = currentLines.shift();
        const pokemon = {
            nickname: null,
            species: null,
            gender: null,
            heldItem: null,
            ability: null,
            level: 100,
            teraType: null,
            evs: { HP: 0, Attack: 0, Defense: 0, "S.Atk": 0, "S.Def": 0, Speed: 0 },
            ivs: { HP: 31, Attack: 31, Defense: 31, "S.Atk": 31, "S.Def": 31, Speed: 31 },
            nature: null,
            moves: []
        };

        Object.assign(pokemon, parseFirstLine(firstLine));

        for (const line of currentLines) {
            if (line.startsWith('Ability:')) {
                pokemon.ability = line.replace('Ability:', '').trim().replace(' ', '-').toLowerCase();
            } else if (line.startsWith('Level:')) {
                pokemon.level = parseInt(line.replace('Level:', '').trim(), 10);
            } else if (line.startsWith('Tera Type:')) {
                pokemon.teraType = line.replace('Tera Type:', '').trim();
            } else if (line.startsWith('EVs:')) {
                const evPairs = line.replace('EVs:', '').trim().split('/');
                for (const pair of evPairs) {
                    const [value, stat] = pair.trim().split(' ');
                    pokemon.evs[getStatsTrueName(stat)] = parseInt(value, 10);
                }
            } else if (line.startsWith('IVs:')) {
                const ivPairs = line.replace('IVs:', '').trim().split('/');
                for (const pair of ivPairs) {
                    const [value, stat] = pair.trim().split(' ');
                    pokemon.ivs[getStatsTrueName(stat)] = parseInt(value, 10);
                }
            } else if (line.endsWith(' Nature')) {
                pokemon.nature = line.replace(' Nature', '').trim().toLowerCase();
            } else if (line.startsWith('- ')) {
                pokemon.moves.push(line.replace('- ', '').trim().replace(' ', '-').toLowerCase());
            }
        }

        while (pokemon.moves.length < 4) {
            pokemon.moves.push(null);
        }

        pokemons.push(pokemon);
        currentLines = [];
    };

    for (const line of lines) {
        if (line.trim() === '') {
            flushPokemon(); // separador de pokémons
        } else {
            currentLines.push(line);
        }
    }
    flushPokemon(); // último Pokémon

    console.log(pokemons);

    return pokemons;
};

export default parseShowdownText;
