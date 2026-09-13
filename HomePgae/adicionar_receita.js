// =====================================================
// FUNÇÕES PARA ABRIR E FECHAR MODAIS
// =====================================================

function showModal(id = "modal") {
    const element = document.getElementById(id);

    if (element) {
        element.classList.add("show-modal");
    }
}


function hideModal(id = "modal") {
    const element = document.getElementById(id);

    if (element) {
        element.classList.remove("show-modal");
    }
}


// =====================================================
// FUNÇÃO PARA OBTER A DATA DO MÊS SELECIONADO
// =====================================================

function obterDataSelecionada() {

    const hoje = new Date();

    // Usa o ano selecionado no calendário
    const ano = anoSelecionado;

    // mesSelecionado começa em 0:
    // Janeiro = 0
    // Fevereiro = 1
    // ...
    // Setembro = 8

    const mes = mesSelecionado + 1;

    // Mantém o dia atual
    let dia = hoje.getDate();

    // Descobre o último dia do mês selecionado
    const ultimoDiaDoMes = new Date(
        ano,
        mes,
        0
    ).getDate();

    // Evita problemas como:
    // dia 31 em fevereiro
    if (dia > ultimoDiaDoMes) {
        dia = ultimoDiaDoMes;
    }

    return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}


// =====================================================
// CRIA A ESTRUTURA FINANCEIRA DO USUÁRIO
// =====================================================

function criarDadosUsuario() {

    return {

        receitas: [],
        despesas: [],
        cartao: []

    };

}


// =====================================================
// ESPERAR A PÁGINA CARREGAR
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("adicionar_receita.js carregado com sucesso!");


    // =====================================================
    // BOTÃO NOVA RECEITA
    // =====================================================

    const btnNovaReceita =
        document.getElementById("btn_NovaReceita");

    if (btnNovaReceita) {

        btnNovaReceita.addEventListener("click", function () {

            hideModal("modal");

            showModal("modalReceita");

        });

    }


    // =====================================================
    // BOTÃO NOVA DESPESA
    // =====================================================

    const btnNovaDespesa =
        document.getElementById("btn_NovaDespesa");

    if (btnNovaDespesa) {

        btnNovaDespesa.addEventListener("click", function () {

            hideModal("modal");

            showModal("modalDespesa");

        });

    }


    // =====================================================
    // BOTÃO ADICIONAR RECEITA DO DASHBOARD
    // =====================================================

    const btnAdicionarReceita =
        document.getElementById("btnAdicionarReceita");

    if (btnAdicionarReceita) {

        btnAdicionarReceita.addEventListener("click", function () {

            showModal("modalReceita");

        });

    }


    // =====================================================
    // FORMULÁRIO DE RECEITA
    // =====================================================

    const formReceita =
        document.getElementById("formReceita");

    if (formReceita) {

        formReceita.addEventListener("submit", function (event) {

            event.preventDefault();

            console.log("SALVAR RECEITA FOI CLICADO!");


            // =================================================
            // PEGA OS CAMPOS
            // =================================================

            const descricaoElement =
                document.getElementById("descricaoReceita");

            const valorElement =
                document.getElementById("valorReceita");


            const descricao =
                descricaoElement.value.trim();

            const valor =
                parseFloat(valorElement.value);


            // =================================================
            // VALIDAÇÃO
            // =================================================

            if (descricao === "") {

                alert("Digite uma descrição.");

                return;

            }


            if (isNaN(valor) || valor <= 0) {

                alert("Digite um valor válido.");

                return;

            }


            // =================================================
            // VERIFICA USUÁRIO LOGADO
            // =================================================

            const usuario =
                localStorage.getItem("usuarioLogado");


            if (!usuario) {

                alert(
                    "Nenhum usuário está logado. Faça login novamente."
                );

                return;

            }


            // =================================================
            // PEGA OS DADOS FINANCEIROS
            // =================================================

            let dadosFinanceiros =
                JSON.parse(
                    localStorage.getItem("dadosFinanceiros")
                ) || {};


            // =================================================
            // CRIA USUÁRIO SE NÃO EXISTIR
            // =================================================

            if (!dadosFinanceiros[usuario]) {

                dadosFinanceiros[usuario] =
                    criarDadosUsuario();

            }


            // =================================================
            // GARANTE QUE OS ARRAYS EXISTAM
            // =================================================

            if (!Array.isArray(dadosFinanceiros[usuario].receitas)) {

                dadosFinanceiros[usuario].receitas = [];

            }

            if (!Array.isArray(dadosFinanceiros[usuario].despesas)) {

                dadosFinanceiros[usuario].despesas = [];

            }

            if (!Array.isArray(dadosFinanceiros[usuario].cartao)) {

                dadosFinanceiros[usuario].cartao = [];

            }


            // =================================================
            // OBTÉM A DATA DO MÊS SELECIONADO
            // =================================================

            const dataSelecionada =
                obterDataSelecionada();


            console.log(
                "Mês selecionado:",
                mesSelecionado + 1
            );

            console.log(
                "Ano selecionado:",
                anoSelecionado
            );

            console.log(
                "Data que será salva:",
                dataSelecionada
            );


            // =================================================
            // CRIA A RECEITA
            // =================================================

            const novaReceita = {

                id: Date.now(),

                descricao: descricao,

                valor: valor,

                data: dataSelecionada

            };


            // =================================================
            // ADICIONA A RECEITA
            // =================================================

            dadosFinanceiros[usuario].receitas.push(
                novaReceita
            );


            // =================================================
            // SALVA NO LOCALSTORAGE
            // =================================================

            localStorage.setItem(
                "dadosFinanceiros",
                JSON.stringify(dadosFinanceiros)
            );


            // =================================================
            // CONSOLE
            // =================================================

            console.log(
                "Receita salva:",
                novaReceita
            );

            console.log(
                "Dados financeiros:",
                dadosFinanceiros[usuario]
            );


            // =================================================
            // ATUALIZA O RESUMO
            // =================================================

            if (typeof atualizarResumo === "function") {

                atualizarResumo();

            } else {

                console.error(
                    "A função atualizarResumo() não foi encontrada."
                );

            }


            // =================================================
            // ATUALIZA O GRÁFICO
            // =================================================

            if (typeof atualizarGraficoDespesas === "function") {

                atualizarGraficoDespesas();

            }


            // =================================================
            // LIMPA OS CAMPOS
            // =================================================

            descricaoElement.value = "";

            valorElement.value = "";


            // =================================================
            // FECHA O MODAL
            // =================================================

            hideModal("modalReceita");


            // =================================================
            // MENSAGEM
            // =================================================

            alert("Receita adicionada com sucesso!");

        });

    } else {

        console.error(
            "ERRO: O formulário formReceita não foi encontrado."
        );

    }


    // =====================================================
    // FORMULÁRIO DE DESPESA
    // =====================================================

    const formDespesa =
        document.getElementById("formDespesa");


    if (formDespesa) {

        formDespesa.addEventListener("submit", function (event) {

            event.preventDefault();

            console.log("SALVAR DESPESA FOI CLICADO!");


            // =================================================
            // PEGA OS CAMPOS
            // =================================================

            const descricaoElement =
                document.getElementById("descricaoDespesa");

            const valorElement =
                document.getElementById("valorDespesa");


            const descricao =
                descricaoElement.value.trim();

            const valor =
                parseFloat(valorElement.value);


            // =================================================
            // VALIDAÇÃO
            // =================================================

            if (descricao === "") {

                alert("Digite uma descrição.");

                return;

            }


            if (isNaN(valor) || valor <= 0) {

                alert("Digite um valor válido.");

                return;

            }


            // =================================================
            // VERIFICA USUÁRIO LOGADO
            // =================================================

            const usuario =
                localStorage.getItem("usuarioLogado");


            if (!usuario) {

                alert(
                    "Nenhum usuário está logado. Faça login novamente."
                );

                return;

            }


            // =================================================
            // PEGA OS DADOS FINANCEIROS
            // =================================================

            let dadosFinanceiros =
                JSON.parse(
                    localStorage.getItem("dadosFinanceiros")
                ) || {};


            // =================================================
            // CRIA USUÁRIO SE NÃO EXISTIR
            // =================================================

            if (!dadosFinanceiros[usuario]) {

                dadosFinanceiros[usuario] =
                    criarDadosUsuario();

            }


            // =================================================
            // GARANTE QUE OS ARRAYS EXISTAM
            // =================================================

            if (!Array.isArray(dadosFinanceiros[usuario].receitas)) {

                dadosFinanceiros[usuario].receitas = [];

            }

            if (!Array.isArray(dadosFinanceiros[usuario].despesas)) {

                dadosFinanceiros[usuario].despesas = [];

            }

            if (!Array.isArray(dadosFinanceiros[usuario].cartao)) {

                dadosFinanceiros[usuario].cartao = [];

            }


            // =================================================
            // OBTÉM A DATA DO MÊS SELECIONADO
            // =================================================

            const dataSelecionada =
                obterDataSelecionada();


            console.log(
                "Mês selecionado:",
                mesSelecionado + 1
            );

            console.log(
                "Ano selecionado:",
                anoSelecionado
            );

            console.log(
                "Data que será salva:",
                dataSelecionada
            );


            // =================================================
            // CRIA A DESPESA
            // =================================================

            const novaDespesa = {

                id: Date.now(),

                descricao: descricao,

                valor: valor,

                data: dataSelecionada

            };


            // =================================================
            // ADICIONA A DESPESA
            // =================================================

            dadosFinanceiros[usuario].despesas.push(
                novaDespesa
            );


            // =================================================
            // SALVA NO LOCALSTORAGE
            // =================================================

            localStorage.setItem(
                "dadosFinanceiros",
                JSON.stringify(dadosFinanceiros)
            );


            // =================================================
            // CONSOLE
            // =================================================

            console.log(
                "Despesa salva:",
                novaDespesa
            );

            console.log(
                "Dados financeiros:",
                dadosFinanceiros[usuario]
            );


            // =================================================
            // ATUALIZA O RESUMO
            // =================================================

            if (typeof atualizarResumo === "function") {

                atualizarResumo();

            } else {

                console.error(
                    "A função atualizarResumo() não foi encontrada."
                );

            }


            // =================================================
            // ATUALIZA O GRÁFICO
            // =================================================

            if (typeof atualizarGraficoDespesas === "function") {

                atualizarGraficoDespesas();

            }


            // =================================================
            // LIMPA OS CAMPOS
            // =================================================

            descricaoElement.value = "";

            valorElement.value = "";


            // =================================================
            // FECHA O MODAL
            // =================================================

            hideModal("modalDespesa");


            // =================================================
            // MENSAGEM
            // =================================================

            alert("Despesa adicionada com sucesso!");

        });

    } else {

        console.error(
            "ERRO: O formulário formDespesa não foi encontrado."
        );

    }

});



