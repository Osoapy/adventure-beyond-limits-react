import Swal from "sweetalert2";
import errorAlert from "./errorAlert";
import parseShowDownText from "../functions/parseShowDownText/parseShowDownText";

const importTeamAlert = async () => {
  const htmlContent = `
    <div style="position: relative; text-align: left; max-height: 350px; overflow-y: scroll;">
      <button id="copy-btn" title="Copiar"
          style="position: absolute; top: 5px; right: 5px; background: transparent; border: none; cursor: pointer;">
          📋
      </button>
      <pre id="showdown-content" contenteditable="true" 
          style="white-space: pre-wrap; word-wrap: break-word; background-color: #f4f4f4; padding: 10px; border-radius: 5px; font-size: 0.85rem; min-height: 150px;">
Cole aqui o texto do time no formato Showdown...
      </pre>
    </div>
  `;

  const result = await Swal.fire({
    title: "Cole ou edite o time no formato Showdown:",
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
    const pokemonList = parseShowDownText(showdownText);
    console.log("before parsing:\n\n", showdownText, "\n\nafter parsing:\n\n", pokemonList);
    return pokemonList;
  }

  return null;
};

export default importTeamAlert;
