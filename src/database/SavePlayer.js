import { db } from "../firebase"; // Ajuste o caminho conforme seu projeto
import { collection, addDoc } from "firebase/firestore";

export async function SavePlayer(objeto) {
  try {
    const docRef = await addDoc(collection(db, "player"), objeto);
    console.log("Documento salvo com ID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Erro ao salvar documento:", e);
    throw e;
  }
}
