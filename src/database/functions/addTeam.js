import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function addTeam(email, teamNumber) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const teamId = `team-${teamNumber}`;

    const teamRef = doc(db, "trainers", normalizedEmail, "teams", teamId);

    await setDoc(teamRef, {
        number: teamNumber,
        createdAt: serverTimestamp()
    });

    console.log("Time criado com sucesso no Firestore");
    return teamId;

  } catch (error) {
    console.error("Erro ao salvar documento:", error);
    throw error;
  }
}