import styles from "./createNewTeamButton.module.scss";
import { addTeam } from "../../../database/functions/addTeam";
import { getAuth } from "firebase/auth";

export default function CreateNewTeamButton({ teamsList, setTeamsList }) {
    const handleCreateNewTeam = async () => {
        const user = getAuth().currentUser;

        if (!user) {
            console.error("Usuário não autenticado");
            return;
        }

        let biggestTeamNumber = 0;

        teamsList.forEach(team => {
            if (team.number > biggestTeamNumber) {
                biggestTeamNumber = team.number;
            }
        });

        const nextTeamNumber = biggestTeamNumber + 1;

        console.log("Próximo número do time:", nextTeamNumber);

        await addTeam(user.email, nextTeamNumber);
        setTeamsList(prev => [...prev, { number: nextTeamNumber }]);
    };

    return (
        <div className={styles.addButtonContainer}>
            <button className={styles.addButton} onClick={handleCreateNewTeam}>
                <p>Create New Team</p>
            </button>
        </div>
    );
}