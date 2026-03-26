import { db } from "../firebase";
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";

export async function excludeTeam(email, teamNumber) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const teamId = `team-${teamNumber}`;

    const pokemonsRef = collection(
      db,
      "trainers",
      normalizedEmail,
      "teams",
      teamId,
      "pokemons"
    );

    // pega todos os pokémons
    const snapshot = await getDocs(pokemonsRef);

    // deleta todos
    const deletePromises = snapshot.docs.map((pokemonDoc) =>
      deleteDoc(pokemonDoc.ref)
    );

    await Promise.all(deletePromises);

    // agora deleta o time
    const teamRef = doc(db, "trainers", normalizedEmail, "teams", teamId);
    await deleteDoc(teamRef);

    console.log("Time e todos os pokémons foram excluídos com sucesso");
    return true;

  } catch (error) {
    console.error("Erro ao excluir time:", error);
    throw error;
  }
}