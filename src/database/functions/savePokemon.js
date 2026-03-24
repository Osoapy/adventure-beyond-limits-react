import { db } from "../firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export async function savePokemon(email, teamNumber, pokemonData) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const teamId = `team-${teamNumber}`;

    const pokemonRef = doc(db, "trainers", normalizedEmail, "teams", teamId, "pokemons", pokemonData.id);

    await updateDoc(pokemonRef, pokemonData);

    console.log("Pokémon salvado com sucesso no Firestore");
  } catch (error) {
    console.error("Erro ao salvar documento:", error);
    throw error;
  }
}