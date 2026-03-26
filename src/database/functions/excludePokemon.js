import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function excludePokemon(email, teamNumber, pokemonId) {
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

    await deleteDoc(pokemonRef);

    console.log("Pokémon excluído com sucesso do Firestore");
  } catch (error) {
    console.error("Erro ao excluir documento:", error);
    throw error;
  }
}