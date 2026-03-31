import styles from "../createNewTeamButton/createNewTeamButton.module.scss";
import importFromShowdownAlert from "../../../utils/alerts/importFromShowdownAlert/importFromShowdownAlert";

export default function ImportFromShowdownButton({ teamList, setTeamList, email }) {
    return (
        <div className={styles.addButtonContainer}>
            <button className={styles.addButton} onClick={() => importFromShowdownAlert(teamList, setTeamList, email)}>
                <p>Import from Showdown</p>
            </button>
        </div>
    );
} 