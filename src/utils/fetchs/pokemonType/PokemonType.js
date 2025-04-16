export default async function GetPrimaryType(species) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${species.toLowerCase()}`);
      if (!response.ok) throw new Error('Pokémon não encontrado');
      
      const data = await response.json();
      const primaryType = data.types.find(t => t.slot === 1)?.type.name;
  
      return primaryType || null;
    } catch (error) {
      console.error('Erro ao buscar o tipo:', error);
      return null;
    }
  }
  