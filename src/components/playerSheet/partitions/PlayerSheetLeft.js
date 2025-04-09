import { useRef, useState } from 'react';
import './playerSheetLeft.css';
import NoImage from '../../../assets/noImageAvailable.png';
import errorAlert from '../../utils/sweetAlerts2/errorAlert';

export default function PlayerSheetLeft() {
    const [imageSrc, setImageSrc] = useState(NoImage);
    const inputRef = useRef(null);

    const handleImageClick = () => {
        inputRef.current?.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            errorAlert("Por favor, selecione um arquivo de imagem válido.");
        }
    };

    return (
        <div className="player-Filled-Left">
            <div className="player-Filled-Left-Inside">
                <div className="player-Filled-Left-Inside-Image-Container">
                    <img
                        className="player-Filled-Left-Inside-Image"
                        src={imageSrc}
                        onClick={handleImageClick}
                        style={{ cursor: 'pointer' }}
                        alt="Avatar"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={inputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </div>
                <div className="player-Filled-Left-Inside-HP-Container">
                    <div className="player-Filled-Left-Inside-HP">HP
                        <div id="creationHP" className="player-Filled-Left-Inside-HP-Value" contentEditable="true" spellCheck="false">0</div>
                    </div>
                </div>
                <div className="player-Filled-Left-Inside-WILL-Container">
                    <div className="player-Filled-Left-Inside-WILL">WILL
                        <div id="creationWILL" className="player-Filled-Left-Inside-WILL-Value" contentEditable="true" spellCheck="false">0</div>
                    </div>
                </div>
            </div>
        </div>
    );
}