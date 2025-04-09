import Swal from "sweetalert2";

const developingAlert = () => {
  Swal.fire({
    icon: "info",
    title: "Oops...",
    text: "Função em desenvolvimento!",
  });
};

export default developingAlert;
