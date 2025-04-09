import './playerSheetLeft.css';
import NoImage from '../assets/noImageAvailable.png';

export default function PlayerSheetLeft() {
    return (
        <div className="player-Filled-Left">
            <div className="player-Filled-Left-Inside">
                <div className="player-Filled-Left-Inside-Image-Container">
                    <img id="showInputBtn" className="player-Filled-Left-Inside-Image" src={NoImage}/>
                </div>
                <div className="player-Filled-Left-Inside-HP-Container">
                    <div className="player-Filled-Left-Inside-HP">HP
                        <div id="creationHP" className="player-Filled-Left-Inside-HP-Value" contentEditable="true" spellCheck="false">0
                        </div>
                    </div>
                </div>
                <div className="player-Filled-Left-Inside-WILL-Container">
                    <div className="player-Filled-Left-Inside-WILL">WILL
                        <div id="creationWILL" className="player-Filled-Left-Inside-WILL-Value" contentEditable="true" spellCheck="false">0
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}