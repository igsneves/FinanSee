// =====================================================
// ATUALIZAR RESUMO FINANCEIRO
// =====================================================

function atualizarResumo() {

    console.log("=================================");
    console.log("ATUALIZANDO RESUMO...");
    console.log("=================================");

    // -------------------------------------------------
    // USUÁRIO LOGADO
    // -------------------------------------------------

    const usuario = localStorage.getItem("usuarioLogado");

    console.log("Usuário logado:", usuario);

    if (!usuario) {
        console.warn("Nenhum usuário logado.");
        zerarCards();
        return;
    }


    // -------------------------------------------------
    // DADOS FINANCEIROS
    // -------------------------------------------------

    const dadosFinanceiros =
        JSON.parse(
            localStorage.getItem("dadosFinanceiros")
        ) || {};

    console.log("Dados financeiros:", dadosFinanceiros);


    // -------------------------------------------------
    // DADOS DO USUÁRIO
    // -------------------------------------------------

    if (!dadosFinanceiros[usuario]) {

        console.warn(
            "Não existem dados financeiros para:",
            usuario
        );

        zerarCards();
        return;
    }

    const dados = dadosFinanceiros[usuario];

    console.log("Dados deste usuário:", dados);


    // -------------------------------------------------
    // MÊS E ANO
    // -------------------------------------------------

    let mes = new Date().getMonth();
    let ano = new Date().getFullYear();


    if (typeof mesSelecionado !== "undefined") {
        mes = mesSelecionado;
    }

    if (typeof anoSelecionado !== "undefined") {
        ano = anoSelecionado;
    }


    const periodoSelecionado =
        `${ano}-${String(mes + 1).padStart(2, "0")}`;

    console.log(
        "Mês selecionado:",
        periodoSelecionado
    );


    // -------------------------------------------------
    // RECEITAS
    // -------------------------------------------------

    const receitas =
        Array.isArray(dados.receitas)
            ? dados.receitas
            : [];


    // -------------------------------------------------
    // DESPESAS
    // -------------------------------------------------

    const despesas =
        Array.isArray(dados.despesas)
            ? dados.despesas
            : [];


    console.log("Todas as receitas:", receitas);
    console.log("Todas as despesas:", despesas);


    // -------------------------------------------------
    // RECEITAS DO MÊS
    // -------------------------------------------------

    const receitasDoMes =
        receitas.filter(receita => {

            return (
                receita.data &&
                receita.data.startsWith(periodoSelecionado)
            );

        });


    // -------------------------------------------------
    // DESPESAS DO MÊS
    // -------------------------------------------------

    const despesasDoMes =
        despesas.filter(despesa => {

            return (
                despesa.data &&
                despesa.data.startsWith(periodoSelecionado)
            );

        });


    console.log(
        "Receitas encontradas neste mês:",
        receitasDoMes
    );

    console.log(
        "Despesas encontradas neste mês:",
        despesasDoMes
    );


    // -------------------------------------------------
    // SOMA RECEITAS
    // -------------------------------------------------

    const totalReceitas =
        receitasDoMes.reduce(
            (total, receita) => {

                return total + Number(receita.valor);

            },
            0
        );


    // -------------------------------------------------
    // SOMA DESPESAS
    // -------------------------------------------------

    const totalDespesas =
        despesasDoMes.reduce(
            (total, despesa) => {

                return total + Number(despesa.valor);

            },
            0
        );


    // -------------------------------------------------
    // BALANÇO
    // -------------------------------------------------

    const saldo =
        totalReceitas - totalDespesas;


    console.log("TOTAL RECEITAS:", totalReceitas);
    console.log("TOTAL DESPESAS:", totalDespesas);
    console.log("BALANÇO:", saldo);


    // -------------------------------------------------
    // ATUALIZA HTML
    // -------------------------------------------------

    const elementoReceitas =
        document.getElementById("totalReceitas");

    const elementoDespesas =
        document.getElementById("totalDespesas");

    const elementoSaldo =
        document.getElementById("saldoAtual");


    console.log("ELEMENTO RECEITAS:", elementoReceitas);
    console.log("ELEMENTO DESPESAS:", elementoDespesas);
    console.log("ELEMENTO SALDO:", elementoSaldo);


    // RECEITAS
    if (elementoReceitas) {

        elementoReceitas.innerText =
            formatarMoeda(totalReceitas);

        elementoReceitas.style.display = "inline";
        elementoReceitas.style.visibility = "visible";
        elementoReceitas.style.opacity = "1";

        console.log(
            "HTML RECEITAS AGORA:",
            elementoReceitas.innerText
        );
    }


    // DESPESAS
    if (elementoDespesas) {

        elementoDespesas.innerText =
            formatarMoeda(totalDespesas);

        elementoDespesas.style.display = "inline";
        elementoDespesas.style.visibility = "visible";
        elementoDespesas.style.opacity = "1";

        console.log(
            "HTML DESPESAS AGORA:",
            elementoDespesas.innerText
        );
    }


    // BALANÇO
    if (elementoSaldo) {

        elementoSaldo.innerText =
            formatarMoeda(saldo);

        elementoSaldo.style.display = "inline";
        elementoSaldo.style.visibility = "visible";
        elementoSaldo.style.opacity = "1";

        console.log(
            "HTML SALDO AGORA:",
            elementoSaldo.innerText
        );
    }

    // -------------------------------------------------
    // CARTÃO
    // -------------------------------------------------

    const elementoCartao =
        document.getElementById("totalCartao");

    if (elementoCartao) {

        elementoCartao.textContent =
            formatarMoeda(0);

    }

}


// =====================================================
// FORMATAR MOEDA
// =====================================================

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// =====================================================
// ZERAR
// =====================================================

function zerarCards() {

    const elementoReceitas =
        document.getElementById("totalReceitas");

    const elementoDespesas =
        document.getElementById("totalDespesas");

    const elementoSaldo =
        document.getElementById("saldoAtual");

    const elementoCartao =
        document.getElementById("totalCartao");


    if (elementoReceitas) {
        elementoReceitas.textContent = "R$ 0,00";
    }

    if (elementoDespesas) {
        elementoDespesas.textContent = "R$ 0,00";
    }

    if (elementoSaldo) {
        elementoSaldo.textContent = "R$ 0,00";
    }

    if (elementoCartao) {
        elementoCartao.textContent = "R$ 0,00";
    }

}



// =====================================================
// QUANDO A PÁGINA CARREGAR
// =====================================================
document.addEventListener("DOMContentLoaded", function () {

    atualizarResumo();

    setTimeout(function () {
        atualizarResumo();
    }, 1000);

});


