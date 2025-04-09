import Swal from "sweetalert2";

const errorAlert = (header, statusCode) => {
  let message = "Algo deu errado, por favor tente novamente.";

  // Verificar o status code da resposta
  statusCode = statusCode || "000";
  if (statusCode.includes("400")) {
    message = "Usuário ou senha incorretos.";
  } else if (statusCode.includes("401")) {
    message = "Não autorizado. Verifique suas permissões.";
  } else if (statusCode.includes("500")) {
    message = "Erro interno no servidor. Tente novamente mais tarde.";
  }

  // Exibe o Swal com a mensagem correspondente
  Swal.fire({
    icon: "error",
    title: header,
    text: message,
    confirmButtonText: "OK",
  });
};

export default errorAlert;
