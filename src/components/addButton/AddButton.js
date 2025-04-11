import addButtonIcon from '../../assets/addButton.png';
import './addButton.css';

export default function AddButton({ onClick }) {
    return (
        <div className="addButtonContainer">
            <button className="addButton" onClick={ onClick }>
                <img className="addButtonImage" src={addButtonIcon}/>
            </button>
        </div>
    );
}