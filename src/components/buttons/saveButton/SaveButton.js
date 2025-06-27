import { FaSave } from "react-icons/fa";
import './saveButton.scss';

const SaveButton = ({onClick}) => {
    return (
        <button
            onClick={onClick}
            className="floating-save-button"
        >
            <FaSave size={24} />
        </button>
    );
}

export default SaveButton;