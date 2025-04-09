import LeagueSymbol from '../../../assets/leagueSymbol.png';
import './playerSheetRight.css';

export default function PlayerSheetTopRight() {
    return (
        <div className="player-Filled-Right-Inside-Top">
            <div className="player-Filled-Right-Inside-Top-Div">
                <img className="player-Filled-Right-Inside-Top-Guild-Image" src={LeagueSymbol}/>
                <div className="player-Filled-Right-Inside-Title-Container">
                    <h1 className="player-Filled-Right-Inside-Title">TRAINER CREATION</h1>
                    <div className="player-Filled-Right-Inside-Rank">
                        <p className="player-Filled-Right-Inside-Rank-Text">Trainer's Rank:</p>
                        <p id="creationRank" className="player-Filled-Right-Inside-Rank-Value" contentEditable="true" spellCheck="false">None
                        </p>
                    </div>
                </div>
            </div>
            <div className="player-Filled-Right-Inside-Name">
                <div className="player-Filled-Right-Inside-Age">
                    <div className="token-Spam-Text-Content small-Spam-Text-Content">AGE:</div>
                    <p id="creationAge" className="spam-Text-Content" contentEditable="true" spellCheck="false">0</p>
                </div>
                <div className="player-Filled-Right-Inside-Player">
                    <div className="token-Spam-Text-Content small-Spam-Text-Content">TRAINER:</div>
                    <p id="creationName" className="spam-Text-Content" contentEditable="true" spellCheck="false">Insert name here...</p>
                </div>
            </div>
        </div>
    );
}