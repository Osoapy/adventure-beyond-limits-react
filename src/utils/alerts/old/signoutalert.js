import Swal from "sweetalert2";

const signOutAlert = () => {
  Swal.fire({
    title: "Você deseja continuar?",
    text: "Você sairá da sua conta no Pokémon Aventuras Além dos Limites.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, continuar",
    cancelButtonText: "Não, cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/";
    }
  });
};

export default signOutAlert;
