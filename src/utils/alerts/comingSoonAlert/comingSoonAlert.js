import Swal from "sweetalert2";

const comingSoonAlert = () => {
  Swal.fire({
    icon: "info",
    title: "Oops...",
    text: "Função em desenvolvimento!",
  });
};

export default comingSoonAlert;
