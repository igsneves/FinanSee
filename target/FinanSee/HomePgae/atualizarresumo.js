// =====================================================
// ATUALIZAR RESUMO FINANCEIRO
// =====================================================

async function atualizarResumo() {

    console.log("=================================");
    console.log("ATUALIZANDO RESUMO PELO MYSQL...");
    console.log("=================================");


    // -------------------------------------------------
    // MÊS E ANO SELECIONADOS
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


    try {

        // -------------------------------------------------
        // BUSCA RECEITAS E DESPESAS NO BACKEND
        // -------------------------------------------------

        const [
            respostaReceitas,
            respostaDespesas
        ] = await Promise.all([

            fetch("../receita"),

            fetch("../despesa")

        ]);


        // -------------------------------------------------
        // VERIFICA SESSÃO
        // -------------------------------------------------

        if (
            respostaReceitas.status === 401 ||
            respostaDespesas.status === 401
        ) {

            console.warn(
                "Sessão expirada."
            );

            zerarCards();

            window.location.href =
                "../TelaInicial/index.html";

            return;
        }


        // -------------------------------------------------
        // VERIFICA ERROS DO SERVIDOR
        // -------------------------------------------------

        if (!respostaReceitas.ok) {

            throw new Error(
                "Erro ao buscar receitas."
            );
        }

        if (!respostaDespesas.ok) {

            throw new Error(
                "Erro ao buscar despesas."
            );
        }


        // -------------------------------------------------
        // CONVERTE AS RESPOSTAS PARA JSON
        // -------------------------------------------------

        const receitas =
            await respostaReceitas.json();

        const despesas =
            await respostaDespesas.json();


        console.log(
            "Receitas recebidas do MySQL:",
            receitas
        );

        console.log(
            "Despesas recebidas do MySQL:",
            despesas
        );


        // -------------------------------------------------
        // FILTRA RECEITAS PELO MÊS
        // -------------------------------------------------

        const receitasDoMes =
            receitas.filter(receita => {

                return (
                    receita.data &&
                    receita.data.startsWith(
                        periodoSelecionado
                    )
                );

            });


        // -------------------------------------------------
        // FILTRA DESPESAS PELO MÊS
        // -------------------------------------------------

        const despesasDoMes =
            despesas.filter(despesa => {

                return (
                    despesa.data &&
                    despesa.data.startsWith(
                        periodoSelecionado
                    )
                );

            });


        console.log(
            "Receitas deste mês:",
            receitasDoMes
        );

        console.log(
            "Despesas deste mês:",
            despesasDoMes
        );


        // -------------------------------------------------
        // TOTAL DE RECEITAS
        // -------------------------------------------------

        const totalReceitas =
            receitasDoMes.reduce(
                (total, receita) => {

                    return (
                        total +
                        Number(receita.valor)
                    );

                },
                0
            );


        // -------------------------------------------------
        // TOTAL DE DESPESAS
        // -------------------------------------------------

        const totalDespesas =
            despesasDoMes.reduce(
                (total, despesa) => {

                    return (
                        total +
                        Number(despesa.valor)
                    );

                },
                0
            );


        // -------------------------------------------------
        // SALDO
        // -------------------------------------------------

        const saldo =
            totalReceitas -
            totalDespesas;


        console.log(
            "TOTAL RECEITAS:",
            totalReceitas
        );

        console.log(
            "TOTAL DESPESAS:",
            totalDespesas
        );

        console.log(
            "SALDO:",
            saldo
        );


        // -------------------------------------------------
        // ATUALIZA OS CARDS
        // -------------------------------------------------

        atualizarCards(
            totalReceitas,
            totalDespesas,
            saldo
        );


    } catch (erro) {

        console.error(
            "Erro ao atualizar resumo:",
            erro
        );

        zerarCards();
    }
}


// =====================================================
// ATUALIZAR CARDS
// =====================================================

function atualizarCards(
    totalReceitas,
    totalDespesas,
    saldo
) {

    const elementoReceitas =
        document.getElementById(
            "totalReceitas"
        );

    const elementoDespesas =
        document.getElementById(
            "totalDespesas"
        );

    const elementoSaldo =
        document.getElementById(
            "saldoAtual"
        );

    const elementoCartao =
        document.getElementById(
            "totalCartao"
        );


    // RECEITAS
    if (elementoReceitas) {

        elementoReceitas.textContent =
            formatarMoeda(
                totalReceitas
            );

        elementoReceitas.style.display =
            "inline";

        elementoReceitas.style.visibility =
            "visible";

        elementoReceitas.style.opacity =
            "1";
    }


    // DESPESAS
    if (elementoDespesas) {

        elementoDespesas.textContent =
            formatarMoeda(
                totalDespesas
            );

        elementoDespesas.style.display =
            "inline";

        elementoDespesas.style.visibility =
            "visible";

        elementoDespesas.style.opacity =
            "1";
    }


    // SALDO
    if (elementoSaldo) {

        elementoSaldo.textContent =
            formatarMoeda(
                saldo
            );

        elementoSaldo.style.display =
            "inline";

        elementoSaldo.style.visibility =
            "visible";

        elementoSaldo.style.opacity =
            "1";
    }


    // CARTÃO
    // Ainda não migramos os dados de cartão.
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
// ZERAR CARDS
// =====================================================

function zerarCards() {

    const elementoReceitas =
        document.getElementById(
            "totalReceitas"
        );

    const elementoDespesas =
        document.getElementById(
            "totalDespesas"
        );

    const elementoSaldo =
        document.getElementById(
            "saldoAtual"
        );

    const elementoCartao =
        document.getElementById(
            "totalCartao"
        );


    if (elementoReceitas) {

        elementoReceitas.textContent =
            "R$ 0,00";
    }

    if (elementoDespesas) {

        elementoDespesas.textContent =
            "R$ 0,00";
    }

    if (elementoSaldo) {

        elementoSaldo.textContent =
            "R$ 0,00";
    }

    if (elementoCartao) {

        elementoCartao.textContent =
            "R$ 0,00";
    }
}


// =====================================================
// QUANDO A PÁGINA CARREGAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        atualizarResumo();

    }
);


