const parseFirstLine = (line) => {
  let match;

  match = line.match(/^(.+?) \((.{2,})\) \((M|F)\) @ (.+)$/);
  if (match) return { nickname: match[1], species: match[2], gender: match[3], item: match[4] };

  match = line.match(/^(.+?) \((.{2,})\) @ (.+)$/);
  if (match) return { nickname: match[1], species: match[2], gender: null, item: match[3] };

  match = line.match(/^(.+?) \((.{2,})\) \((M|F)\)$/);
  if (match) return { nickname: match[1], species: match[2], gender: match[3], item: null };

  match = line.match(/^(.+?) \((.{2,})\)$/);
  if (match) return { nickname: match[1], species: match[2], gender: null, item: null };

  match = line.match(/^(.{2,}) \((M|F)\) @ (.+)$/);
  if (match) return { nickname: null, species: match[1].trim(), gender: match[2], item: match[3] };

  match = line.match(/^(.{2,}) \((M|F)\)$/);
  if (match) return { nickname: null, species: match[1].trim(), gender: match[2], item: null };

  match = line.match(/^(.{2,}) @ (.+)$/);
  if (match) return { nickname: null, species: match[1].trim(), gender: null, item: match[2] };

  match = line.match(/^.{2,}$/);
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
        pokemon.ability = line.replace('Ability:', '').trim();
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
        pokemon.nature = line.replace(' Nature', '').trim();
      } else if (line.startsWith('- ')) {
        pokemon.moves.push(line.replace('- ', '').trim());
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

  return pokemons;
};

export default parseShowDownText;
