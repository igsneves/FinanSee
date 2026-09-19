function pegarUsuarioLogado() {

    return localStorage.getItem("usuarioLogado");

}


// =====================================================
// PEGAR DADOS FINANCEIROS
// =====================================================

function pegarDadosFinanceiros() {

    const usuario = pegarUsuarioLogado();

    if (!usuario) {

        return null;

    }


    let dados =
        JSON.parse(
            localStorage.getItem("dadosFinanceiros")
        ) || {};


    // =================================================
    // CRIA A ESTRUTURA DO USUÁRIO
    // =================================================

    if (!dados[usuario]) {

        dados[usuario] = {

            receitas: [],
            despesas: [],
            cartao: []

        };


        localStorage.setItem(
            "dadosFinanceiros",
            JSON.stringify(dados)
        );

    }


    // =================================================
    // GARANTE QUE OS DADOS SÃO ARRAYS
    // =================================================

    if (!Array.isArray(dados[usuario].receitas)) {

        dados[usuario].receitas = [];

    }


    if (!Array.isArray(dados[usuario].despesas)) {

        dados[usuario].despesas = [];

    }


    if (!Array.isArray(dados[usuario].cartao)) {

        dados[usuario].cartao = [];

    }


    return dados[usuario];

}


// =====================================================
// SALVAR DADOS FINANCEIROS
// =====================================================

function salvarDadosFinanceiros(dadosUsuario) {

    const usuario = pegarUsuarioLogado();

    if (!usuario) {

        return;

    }


    let dados =
        JSON.parse(
            localStorage.getItem("dadosFinanceiros")
        ) || {};


    dados[usuario] = dadosUsuario;


    localStorage.setItem(
        "dadosFinanceiros",
        JSON.stringify(dados)
    );

}