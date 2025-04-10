import PlayerSheetBottomRight from './partitions/playerSheetBottomRight/PlayerSheetBottomRight'
import PlayerSheetLeft from './partitions/playerSheetLeft/PlayerSheetLeft'
import PlayerSheetTopRight from './partitions/playerSheetTopRight/PlayerSheetTopRight'
import { useEffect } from 'react';
import { SavePlayer } from './SavePlayer';
import { useNavigate } from "react-router-dom";
import './playerSheet.css'

export default function PlayerSheet() {
    const navigate = useNavigate();
    function navigateToPage(url) {
        navigate(url);
    }

    useEffect(() => {
        const greenButton = document.getElementById("greenButton");
        const redButton = document.getElementById("redButton");

        const getValue = (id) => {
            const el = document.getElementById(id);
            return el ? el.textContent : "";
        };

        const resetValue = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };

        const handleSave = async () => {
            const imageBase64 = document.querySelector(".player-Filled-Left-Inside-Image")?.src;

            const objeto = {
                email: sessionStorage.getItem("email"),
                player: getValue("creationPlayer"),
                concept: getValue("creationConcept"),
                nature: getValue("creationNature"),
                confidence: getValue("creationConfidence"),
                money: getValue("creationMoney"),
                rank: getValue("creationRank"),
                age: getValue("creationAge"),
                name: getValue("creationName"),
                will: getValue("creationWILL"),
                hp: getValue("creationHP"),
                imageBase64: imageBase64.includes("noImageAvailable") ? null : imageBase64
            };

            console.log("Tentando salvar objeto:", objeto);

            try {
                await SavePlayer(objeto);
                alert("Personagem salvo com sucesso!");
                navigateToPage("/main");
            } catch (e) {
                alert("Erro ao salvar personagem.");
            }
        };

        const handleReset = () => {
            resetValue("creationPlayer", "???");
            resetValue("creationConcept", "???");
            resetValue("creationNature", "???");
            resetValue("creationConfidence", "0");
            resetValue("creationMoney", "0");
            resetValue("creationRank", "None");
            resetValue("creationAge", "0");
            resetValue("creationName", "Insert name here...");
            resetValue("creationWILL", "0");
            resetValue("creationHP", "0");
        };

        greenButton?.addEventListener("click", handleSave);
        redButton?.addEventListener("click", handleReset);

        return () => {
            greenButton?.removeEventListener("click", handleSave);
            redButton?.removeEventListener("click", handleReset);
        };
    }, []);

    return (
        <div className='page-Container'>
            <div className="player-Filled-Container" id="creationToken">
                <div className="player-Filled">
                    <PlayerSheetLeft></PlayerSheetLeft>
                    <div className="player-Filled-Right">
                        <PlayerSheetBottomRight></PlayerSheetBottomRight>
                        <PlayerSheetTopRight></PlayerSheetTopRight>
                    </div>
                </div>
            </div>
        </div>
    );
}