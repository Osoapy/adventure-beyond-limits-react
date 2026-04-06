import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function excludePokemon(email, teamNumber, pokemonId, setTeams, closeSwal) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const teamId = `team-${teamNumber}`;

    const pokemonRef = doc(
      db,
      "trainers",
      normalizedEmail,
      "teams",
      teamId,
      "pokemons",
      pokemonId
    );

    setTeams(prevTeams =>
      prevTeams.map(team => {
        if (team.number === teamNumber) {
          return {
            ...team,
            pokemons: team.pokemons.filter(p => p.id !== pokemonId)
          };
        }
        return team;
      })
    );
    await deleteDoc(pokemonRef);

    console.log("Pokémon excluído com sucesso do Firestore");
    closeSwal();

  } catch (error) {
    console.error("Erro ao excluir documento:", error);
    throw error;
  }
}