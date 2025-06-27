const parseFirstLine = (line) => {
  line = line.trim();
  let match;

  // nickname + species + gender + item
  match = line.match(/^(.+?) \(([^()]+)\) \((M|F)\) @ (.+)$/);
  if (match) return { nickname: match[1].trim(), species: match[2].trim(), gender: match[3], item: match[4].trim().replace(' ', '-').toLowerCase() };

  // nickname + species + item
  match = line.match(/^(.+?) \(([^()]+)\) @ (.+)$/);
  if (match) return { nickname: match[1].trim(), species: match[2].trim(), gender: null, item: match[3].trim().replace(' ', '-').toLowerCase() };

  // nickname + species + gender
  match = line.match(/^(.+?) \(([^()]+)\) \((M|F)\)$/);
  if (match) return { nickname: match[1].trim(), species: match[2].trim(), gender: match[3], item: null };

  // nickname + species
  match = line.match(/^(.+?) \(([^()]+)\)$/);
  if (match) return { nickname: match[1].trim(), species: match[2].trim(), gender: null, item: null };

  // species + gender + item
  match = line.match(/^([^()]+) \((M|F)\) @ (.+)$/);
  if (match) return { nickname: null, species: match[1].trim(), gender: match[2], item: match[3].trim().replace(' ', '-').toLowerCase() };

  // species + gender
  match = line.match(/^([^()]+) \((M|F)\)$/);
  if (match) return { nickname: null, species: match[1].trim(), gender: match[2], item: null };

  // species + item
  match = line.match(/^([^()]+) @ (.+)$/);
  if (match) return { nickname: null, species: match[1].trim(), gender: null, item: match[2].trim().replace(' ', '-').toLowerCase() };

  // species only
  match = line.match(/^([^()]+)$/);
  if (match) return { nickname: null, species: line.trim(), gender: null, item: null };

  throw new Error("Linha inicial mal formatada: " + line);
};

const parseShowDownText = (text) => {
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
      item: null,
      ability: null,
      level: 100,
      teraType: null,
      evs: { HP: 0, Atk: 0, Def: 0, SpA: 0, SpD: 0, Spe: 0 },
      ivs: { HP: 31, Atk: 31, Def: 31, SpA: 31, SpD: 31, Spe: 31 },
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
          pokemon.evs[stat] = parseInt(value, 10);
        }
      } else if (line.startsWith('IVs:')) {
        const ivPairs = line.replace('IVs:', '').trim().split('/');
        for (const pair of ivPairs) {
          const [value, stat] = pair.trim().split(' ');
          pokemon.ivs[stat] = parseInt(value, 10);
        }
      } else if (line.endsWith(' Nature')) {
        pokemon.nature = line.replace(' Nature', '').trim().toLowerCase();
      } else if (line.startsWith('- ')) {
        pokemon.moves.push(line.replace('- ', '').trim().replace(' ', '-').toLowerCase());
      }
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

export default parseShowDownText;
