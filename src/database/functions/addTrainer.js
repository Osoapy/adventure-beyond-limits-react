import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function addTrainer(email) {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    await setDoc(doc(db, "trainers", normalizedEmail), {
      createdAt: serverTimestamp()
    });

    console.log("Trainer criado com sucesso");
    return normalizedEmail;
  } catch (e) {
    console.error("Erro ao salvar documento:", e);
    throw e;
  }
}