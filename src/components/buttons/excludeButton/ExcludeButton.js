import { FaTrash } from "react-icons/fa";
import styles from './excludeButton.module.scss';

const ExcludeButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className={styles["floating-delete-button"]}
        >
            <FaTrash size={24} />
        </button>
    );
}

export default ExcludeButton;