import './addTeamButton.scss';

export default function AddButton({ onClick }) {
    return (
        <div className="addButtonContainer">
            <button className="addButton" onClick={ onClick }>
                <p>Criar novo time</p>
            </button>
        </div>
    );
}