import styles from "../createNewTeamButton/createNewTeamButton.module.scss";
import importFromShowdownAlert from "../../../utils/alerts/importFromShowdownAlert/importFromShowdownAlert";

const ImportFromShowdownButton = () => {
  return (
        <div className={styles.addButtonContainer}>
            <button className={styles.addButton} onClick={importFromShowdownAlert}>
                <p>Import from Showdown</p>
            </button>
        </div>
  );
} 

export default ImportFromShowdownButton;