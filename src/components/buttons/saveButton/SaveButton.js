import { FaSave } from "react-icons/fa";
import styles from './saveButton.module.scss';

const SaveButton = ({onClick}) => {
    return (
        <button
            onClick={onClick}
            className={styles["floating-save-button"]}
        >
            <FaSave size={24} />
        </button>
    );
}

export default SaveButton;