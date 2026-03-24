import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function addPokemon(email, teamNumber, pokemonData) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const teamId = `team-${teamNumber}`;

    const teamRef = doc(db, "trainers", normalizedEmail, "teams", teamId, "pokemons", pokemonData.id);

    await setDoc(teamRef, {
        teamNumber: teamNumber,
        createdAt: serverTimestamp(),
        ...pokemonData
    });

    console.log("Pokémon criado com sucesso no Firestore");
  } catch (error) {
    console.error("Erro ao salvar documento:", error);
    throw error;
  }
}