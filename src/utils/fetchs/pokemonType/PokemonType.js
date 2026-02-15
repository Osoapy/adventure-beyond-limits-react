import needSwitch from '../../functions/needSwitch/needSwitch';

export default async function GetPrimaryType(species) {
    try {
      let url = `https://pokeapi.co/api/v2/pokemon/${species.toLowerCase()}`;
      url = needSwitch(species);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Pokémon não encontrado');
      
      const data = await response.json();
      const primaryType = data.types.find(t => t.slot === 1)?.type.name;
  
      return primaryType || null;
    } catch (error) {
      console.error('Erro ao buscar o tipo:', error);
      return null;
    }
  }
  