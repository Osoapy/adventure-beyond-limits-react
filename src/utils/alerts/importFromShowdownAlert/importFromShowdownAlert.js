import Swal from "sweetalert2";
import errorAlert from "../errorAlert/errorAlert";
import parseShowdownText from "../../parseShowdownText/parseShowdownText";
import handleCreateNewTeam from "../../handleCreateNewTeam/handleCreateNewTeam";
import { addPokemon } from "../../../database/functions/addPokemon";

const importFromShowdownAlert = async (teamList, setTeamList, email) => {
    const htmlContent = `
        <style>
        #showdown-content:empty:before {
            content: attr(data-placeholder);
            color: #888;
            pointer-events: none;
        }
        </style>
        <div style="position: relative; text-align: left; max-height: 350px; overflow-y: scroll;">
            <button id="copy-btn" title="Copiar"
                style="position: absolute; top: 5px; right: 5px; background: transparent; border: none; cursor: pointer;">
                📋
            </button>
            <div id="showdown-content" contenteditable="true" data-placeholder="Cole aqui o texto do time no formato ShowDown..." style="white-space: pre-wrap; word-wrap: break-word; background-color: #f4f4f4; padding: 10px; border-radius: 5px; font-size: 0.85rem; min-height: 150px;"></div>
        </div>
    `;

    const result = await Swal.fire({
        title: "Cole o time no formato ShowDown:",
        html: htmlContent,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        width: 600,
        didOpen: () => {
            const copyBtn = document.getElementById("copy-btn");
            const showdownContent = document.getElementById("showdown-content");
            copyBtn.addEventListener("click", () => {
                navigator.clipboard.writeText(showdownContent.innerText);
                copyBtn.innerText = "✅";
                setTimeout(() => (copyBtn.innerText = "📋"), 1500);
            });
        },
    });

    if (result.isConfirmed) {
        const showdownText = document.getElementById("showdown-content").innerText.trim();
        if (!showdownText) {
            errorAlert("Conteúdo vazio", "-1", "Por favor, insira ou cole o time no formato Showdown.");
            return null;
        }
        const pokemonList = parseShowdownText(showdownText);
        console.log("before parsing:\n\n", showdownText, "\n\nafter parsing:\n\n", pokemonList);
        const showdownImportedTeamNumber = await handleCreateNewTeam(teamList, setTeamList, pokemonList);
        for (const pokemonData of pokemonList) {
            await addPokemon(email, showdownImportedTeamNumber, pokemonData);
        }
        return pokemonList;
    }

    return null;
};

export default importFromShowdownAlert;
