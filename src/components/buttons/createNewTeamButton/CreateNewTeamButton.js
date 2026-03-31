import styles from "./createNewTeamButton.module.scss";
import handleCreateNewTeam from "../../../utils/handleCreateNewTeam/handleCreateNewTeam";

export default function CreateNewTeamButton({ teamsList, setTeamsList }) {
    return (
        <div className={styles.addButtonContainer}>
            <button className={styles.addButton} onClick={() => handleCreateNewTeam(teamsList, setTeamsList)}>
                <p>Create New Team</p>
            </button>
        </div>
    );
}