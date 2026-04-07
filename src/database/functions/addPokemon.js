import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function addPokemon(email, teamNumber, pokemonData, setTeamsList) {
  try {
    if (!pokemonData.id) {
      pokemonData.id = `pokemonID-${Date.now()}`;
    }
    const normalizedEmail = email.toLowerCase().trim();
    const teamId = `team-${teamNumber}`;

    const teamRef = doc(db, "trainers", normalizedEmail, "teams", teamId, "pokemons", pokemonData.id);

    await setDoc(teamRef, {
        teamNumber: teamNumber,
        createdAt: serverTimestamp(),
        ...pokemonData
    });
    setTeamsList(prev => {
      return prev.map(t => {
        if (t.number === teamNumber) {
          return {
            ...t,
            pokemons: [...t.pokemons, pokemonData]
          };
        }
        return t;
      });
    });

    console.log("Pokémon criado com sucesso no Firestore");
  } catch (error) {
    console.error("Erro ao salvar documento:", error);
    throw error;
  }
}