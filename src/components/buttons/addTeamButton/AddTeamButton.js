import './addTeamButton.scss';

export default function AddTeamButton({ onClick }) {
    return (
        <div className="addButtonContainer">
            <button className="addButton" onClick={ onClick }>
                <p>Criar novo time</p>
            </button>
        </div>
    );
}