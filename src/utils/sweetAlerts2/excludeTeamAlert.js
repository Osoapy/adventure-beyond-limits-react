import Swal from "sweetalert2";
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const excludeTeamAlert = async (teamNumber) => {
    const result = await Swal.fire({
        title: "Você deseja excluir o time?",
        text: "Essa ação não poderá ser desfeita!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
        const pokemonsRef = collection(db, "pokemon");
        try {
            const q = query(pokemonsRef, where("team", "==", teamNumber));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                console.log(`Nenhum Pokémon encontrado para o time número: ${teamNumber}`);
            }

            for (const docSnap of snapshot.docs) {
                await deleteDoc(doc(db, "pokemon", docSnap.id));
                console.log(`Deletado: ${docSnap.id}`);
            }
        } catch (error) {
            console.error("Erro ao deletar Pokémon:", error);
        }
    }
};

export default excludeTeamAlert;
