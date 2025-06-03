import greenButton from '../../../../assets/greenButton.png';
import redButton from '../../../../assets/redButton.png';
import './playerSheetRight.scss';

export default function PlayerSheetBottomRight() {
    return (
        <div className="player-Filled-Right-Inside">
            <div className="player-Filled-Right-Inside-Player-Container">
                <div className="player-Filled-Right-Inside-Player-Name">
                    <div className="token-Spam-Text-Content">PLAYER:</div>
                    <p id="creationPlayer" className="spam-Text-Content" contentEditable="true" spellCheck="false">???</p>
                </div>
                <div className="player-Filled-Right-Inside-Player-Concept">
                    <div className="token-Spam-Text-Content">CONCEPT:</div>
                    <p id="creationConcept" className="spam-Text-Content" contentEditable="true" spellCheck="false">???</p>
                </div>
            </div>
            <div className="player-Filled-Right-Inside-Nature-Container">
                <div className="player-Filled-Right-Inside-Nature">
                    <div className="player-Filled-Right-Inside-Nature-Value">
                        <div className="token-Spam-Text-Content">NATURE:</div>
                        <p id="creationNature" className="spam-Text-Content" contentEditable="true" spellCheck="false">???</p>
                    </div>
                    <div className="player-Filled-Right-Inside-Confidence-Value-Container">Confidence:
                        <div id="creationConfidence" className="player-Filled-Right-Inside-Confidence-Value" contentEditable="true" spellCheck="false">0
                        </div>
                    </div>
                </div>
                <div className="player-Filled-Right-Inside-Money">
                    <div className="token-Spam-Text-Content">MONEY:</div>
                    <p id="creationMoney" className="spam-Text-Content" contentEditable="true" spellCheck="false">0</p>
                </div>
            </div>
            <div className="playerCreationButtons">
                <img id="redButton" src={redButton}/>
                <img id="greenButton" src={greenButton}/>
            </div>
        </div>
    );
}