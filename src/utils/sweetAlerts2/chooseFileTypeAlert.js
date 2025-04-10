import Swal from "sweetalert2";

const chooseFileTypeAlert = () => {
  return Swal.fire({
    title: "Escolha o formato de salvamento",
    input: "radio",
    inputOptions: {
      pdf: "PDF",
      png: "PNG",
      jpeg: "JPEG",
    },
    inputValidator: (value) => {
      if (!value) {
        return "Você precisa escolher um formato!";
      }
    },
    showCancelButton: true,
    confirmButtonText: "Salvar",
    cancelButtonText: "Cancelar",
  });
};

export default chooseFileTypeAlert;
