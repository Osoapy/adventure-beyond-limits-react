import Swal from "sweetalert2";
import errorAlert from "./errorAlert";

const shareTeamAlert = (pokemonTeam) => {
    console.log("pokemons in the team: ", pokemonTeam);

    if (!pokemonTeam) {
        errorAlert("Ainda não tem pokemons no seu time", "-1", "Uma jornada é muito mais triste de se viver sozinho :( recomendamos que busque algum companheiro!");
        return;
    }

    let showDownText = ``

    for (let i = 0; i < pokemonTeam.length; i++) {
        const p = pokemonTeam[i];

        // NICKNAME & SPECIES
        if (p.nickname && p.nickname.trim() !== "") {
            showDownText += `${p.nickname} (${p.species}) `;
        } else {
            showDownText += `${p.species} `;
        }

        // GENDER
        if (p.gender === "female") showDownText += `(F) `;
        else if (p.gender === "male") showDownText += `(M) `;

        // HELD ITEM
        if (p.heldItem && p.heldItem.trim() !== "") {
            showDownText += `@ ${p.heldItem}`;
        }

        showDownText += `\n`;

        // ABILITY
        if (p.ability) showDownText += `Ability: ${p.ability}\n`;

        // SHINY
        if (p.shiny) showDownText += `Shiny: Yes\n`;

        // TERA TYPE
        if (p.teraType) showDownText += `Tera Type: ${p.teraType}\n`;

        // EVs
        if (p.evs) {
        const evList = [];
        for (const stat in p.evs) {
            let correctWrite = "";
            switch (stat) {
                case "Defense":
                    correctWrite = "Def";
                    break;
                case "Attack":
                    correctWrite = "Atk";
                    break;
                case "S.Atk":
                    correctWrite = "SpA";
                    break;
                case "S.Def":
                    correctWrite = "SpD";
                    break;
                case "Speed":
                    correctWrite = "Spd";
                    break;
                default:
                    correctWrite = "HP";
            }
            if (p.evs[stat] > 0) evList.push(`${p.evs[stat]} ${correctWrite}`);
        }
        if (evList.length) showDownText += `EVs: ${evList.join(" / ")}\n`;
        }

        // NATURE
        if (p.nature) showDownText += `${p.nature} Nature\n`;

        // IVs
        if (p.ivs) {
        const ivList = [];
        for (const stat in p.ivs) {
            let correctWrite = "";
            switch (stat) {
                case "Defense":
                    correctWrite = "Def";
                    break;
                case "Attack":
                    correctWrite = "Atk";
                    break;
                case "S.Atk":
                    correctWrite = "SpA";
                    break;
                case "S.Def":
                    correctWrite = "SpD";
                    break;
                case "Speed":
                    correctWrite = "Spd";
                    break;
                default:
                    correctWrite = "HP";
            }
            if (p.ivs[stat] < 31) ivList.push(`${p.ivs[stat]} ${correctWrite}`);
        }
        if (ivList.length) showDownText += `IVs: ${ivList.join(" / ")}\n`;
        }

        // MOVES
        if (p.moves && Array.isArray(p.moves)) {
            for (const move of p.moves) {
                if (move === "") continue;
                showDownText += `- ${move}\n`;
            }
        }

        showDownText += `\n`; // separa os pokémon
    }

    console.log(showDownText);

    const htmlContent = `
        <div style="position: relative; text-align: left;">
            <button id="copy-btn" title="Copiar"
                style="position: absolute; top: 5px; right: 5px; background: transparent; border: none; cursor: pointer;">
                📋
            </button>
            <pre style="white-space: pre-wrap; word-wrap: break-word; background-color: #f4f4f4; padding: 10px; border-radius: 5px; margin-top: 30px; font-size: 0.85rem;">
${showDownText}
            </pre>
        </div>
    `;

    Swal.fire({
        title: "Time copiado no formato Showdown!",
        html: htmlContent,
        showConfirmButton: false,
        width: 600,
        didOpen: () => {
            navigator.clipboard.writeText(showDownText);
            document.getElementById("copy-btn").addEventListener("click", () => {
                navigator.clipboard.writeText(showDownText);
                let thisButton = document.getElementById("copy-btn");
                thisButton.innerText = "✅";
                setTimeout(() => (thisButton.innerText = "📋"), 1500);
                console.log("Texto copiado!");
            });
        },
    });
};

export default shareTeamAlert;
