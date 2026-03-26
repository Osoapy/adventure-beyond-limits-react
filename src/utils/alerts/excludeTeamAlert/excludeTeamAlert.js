import Swal from "sweetalert2";
import { excludeTeam } from "../../../database/functions/excludeTeam";

const excludeTeamAlert = async (email, teamNumber) => {
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
        excludeTeam(email, teamNumber)
    }
};

export default excludeTeamAlert;
