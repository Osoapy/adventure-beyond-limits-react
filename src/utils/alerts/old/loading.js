import Swal from "sweetalert2";

const loadingAlert = async (awaitFunction) => {
    Swal.fire({
        title: 'Carregando...',
        html: `Sua consulta chegará em breve.`,
        allowOutsideClick: false,
        didOpen: async () => {
            Swal.showLoading();
            let errorHasOccurred = false;
            try {
                // Aguarda a conclusão da função assíncrona passada como argumento
                await awaitFunction();
            } catch (error) {
                errorHasOccurred = true;
                console.error(error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                Swal.fire('Erro', `Um erro ocorreu: ${errorMessage}`, 'error'); // Exibe um pop-up de erro
            } finally {
                if (!errorHasOccurred) {
                    Swal.close(); // Fecha o modal de carregamento
                }
            }
        },
    });
};

export default loadingAlert;