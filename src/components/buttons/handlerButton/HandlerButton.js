import './handlerButton.scss';

export default function HandlerButton({ onClick, label }) {
    return (
        <div className="addButtonContainer">
            <button className="addButton" onClick={ onClick }>
                <p>{label}</p>
            </button>
        </div>
    );
}