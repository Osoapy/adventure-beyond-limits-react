import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default async function MarkHasChanges() {
    const normalizedEmail = localStorage.getItem("normalizedEmail");
    if (!normalizedEmail) {
        console.error("Normalized email não encontrado no localStorage.");
        return;
    }

    try {
        const hasChangesDocRef = doc(db, "hasChanges", normalizedEmail);

        await updateDoc(hasChangesDocRef, {
            hasChanges: true
        });

        console.log("hasChanges atualizado!");
    } catch (error) {
        console.error("Erro ao atualizar hasChanges:", error);
    }
}