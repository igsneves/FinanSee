
let graficoDespesasCategoria = null;


// =====================================================
// FORMATAR VALOR EM REAL
// =====================================================

function formatarMoeda(valor) {

    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// =====================================================
// PEGAR DADOS DO USUÁRIO LOGADO
// =====================================================

function carregarDadosFinanceiros() {

    const usuario =
        localStorage.getItem("usuarioLogado");

    const dadosSalvos =
        localStorage.getItem("dadosFinanceiros");


    if (!usuario || !dadosSalvos) {

        return {
            receitas: [],
            despesas: []
        };
    }


    try {

        const dados =
            JSON.parse(dadosSalvos);


        const dadosUsuario =
            dados[usuario];


        if (!dadosUsuario) {

            return {
                receitas: [],
                despesas: []
            };
        }


        return {

            receitas:
                Array.isArray(dadosUsuario.receitas)
                    ? dadosUsuario.receitas
                    : [],

            despesas:
                Array.isArray(dadosUsuario.despesas)
                    ? dadosUsuario.despesas
                    : []

        };

    } catch (erro) {

        console.error(
            "Erro ao carregar dados financeiros:",
            erro
        );

        return {
            receitas: [],
            despesas: []
        };
    }
}


// =====================================================
// PEGAR MÊS ATUAL
// =====================================================

function obterMesAtual() {

    const hoje = new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");


    return `${ano}-${mes}`;
}


// =====================================================
// SOMAR CATEGORIA
// =====================================================

function somarCategoria(lista, categoria) {

    return lista.reduce(
        (total, item) => {

            const categoriaItem =
                String(
                    item.categoria || ""
                ).trim().toLowerCase();


            if (
                categoriaItem ===
                categoria.toLowerCase()
            ) {

                return (
                    total +
                    Number(item.valor || 0)
                );
            }


            return total;

        },
        0
    );
}


// =====================================================
// CALCULAR PORCENTAGEM
// =====================================================

function calcularPorcentagem(
    valor,
    total,
    elementoPorcentagem,
    elementoBarra
) {

    let porcentagem = 0;


    if (total > 0) {

        porcentagem =
            (valor / total) * 100;
    }


    porcentagem =
        Number(
            porcentagem.toFixed(1)
        );


    const elemento =
        document.getElementById(
            elementoPorcentagem
        );


    const barra =
        document.getElementById(
            elementoBarra
        );


    if (elemento) {

        elemento.textContent =
            `${porcentagem}%`;
    }


    if (barra) {

        barra.style.width =
            `${porcentagem}%`;
    }
}


// =====================================================
// ATUALIZAR GRÁFICO
// =====================================================

function atualizarGraficoContas(
    compras,
    alimentacao,
    casa,
    outros
) {

    const canvas =
        document.getElementById(
            "graficoDespesasCategoria"
        );


    if (!canvas) {

        console.error(
            "Canvas graficoDespesasCategoria não encontrado."
        );

        return;
    }


    // Destrói gráfico anterior

    if (graficoDespesasCategoria) {

        graficoDespesasCategoria.destroy();

        graficoDespesasCategoria = null;
    }


    graficoDespesasCategoria =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "Compras",
                        "Alimentação",
                        "Casa",
                        "Outros"
                    ],

                    datasets: [

                        {

                            data: [
                                compras,
                                alimentacao,
                                casa,
                                outros
                            ],

                            borderWidth: 2

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position: "bottom"

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (context) {

                                        return (
                                            context.label +
                                            ": " +
                                            formatarMoeda(
                                                context.raw
                                            )
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );
}


// =====================================================
// ATUALIZAR PÁGINA CONTAS
// =====================================================

function atualizarContas() {

    console.log(
        "Atualizando página Contas..."
    );


    const dados =
        carregarDadosFinanceiros();


    // =================================================
    // MÊS QUE SERÁ ANALISADO
    // =================================================

    let mesSelecionadoContas;


    // Se o calendário existir, usa o mês selecionado

    if (
        typeof mesSelecionado !==
        "undefined" &&
        typeof anoSelecionado !==
        "undefined"
    ) {

        mesSelecionadoContas =
            `${anoSelecionado}-${String(
                mesSelecionado + 1
            ).padStart(2, "0")}`;

    } else {

        mesSelecionadoContas =
            obterMesAtual();
    }


    console.log(
        "Mês analisado:",
        mesSelecionadoContas
    );


    // =================================================
    // FILTRAR RECEITAS
    // =================================================

    const receitasDoMes =
        dados.receitas.filter(
            receita => {

                if (!receita.data) {

                    return false;
                }


                return (
                    receita.data.substring(0, 7) ===
                    mesSelecionadoContas
                );

            }
        );


    // =================================================
    // FILTRAR DESPESAS
    // =================================================

    const despesasDoMes =
        dados.despesas.filter(
            despesa => {

                if (!despesa.data) {

                    return false;
                }


                return (
                    despesa.data.substring(0, 7) ===
                    mesSelecionadoContas
                );

            }
        );


    console.log(
        "Receitas do mês:",
        receitasDoMes
    );


    console.log(
        "Despesas do mês:",
        despesasDoMes
    );


    // =================================================
    // TOTAL DE RECEITAS
    // =================================================

    const totalReceitas =
        receitasDoMes.reduce(
            (total, receita) => {

                return (
                    total +
                    Number(
                        receita.valor || 0
                    )
                );

            },
            0
        );


    // =================================================
    // TOTAL DE DESPESAS
    // =================================================

    const totalDespesas =
        despesasDoMes.reduce(
            (total, despesa) => {

                return (
                    total +
                    Number(
                        despesa.valor || 0
                    )
                );

            },
            0
        );


    // =================================================
    // SALDO
    // =================================================

    const saldo =
        totalReceitas -
        totalDespesas;


    // =================================================
    // ATUALIZA CARDS
    // =================================================

    const saldoElement =
        document.getElementById(
            "saldoContas"
        );


    const receitasElement =
        document.getElementById(
            "totalReceitasContas"
        );


    const despesasElement =
        document.getElementById(
            "totalDespesasContas"
        );


    if (saldoElement) {

        saldoElement.textContent =
            formatarMoeda(saldo);
    }


    if (receitasElement) {

        receitasElement.textContent =
            formatarMoeda(totalReceitas);
    }


    if (despesasElement) {

        despesasElement.textContent =
            formatarMoeda(totalDespesas);
    }


    // =================================================
    // DESPESAS POR CATEGORIA
    // =================================================

    const compras =
        somarCategoria(
            despesasDoMes,
            "Compras"
        );


    const alimentacao =
        somarCategoria(
            despesasDoMes,
            "Alimentação"
        );


    const casa =
        somarCategoria(
            despesasDoMes,
            "Casa"
        );


    const outros =
        somarCategoria(
            despesasDoMes,
            "Outros"
        );


    console.log(
        "Compras:",
        compras
    );

    console.log(
        "Alimentação:",
        alimentacao
    );

    console.log(
        "Casa:",
        casa
    );

    console.log(
        "Outros:",
        outros
    );


    // =================================================
    // MOSTRAR VALORES DAS CATEGORIAS
    // =================================================

    document.getElementById(
        "valorCompras"
    ).textContent =
        formatarMoeda(compras);


    document.getElementById(
        "valorAlimentacao"
    ).textContent =
        formatarMoeda(alimentacao);


    document.getElementById(
        "valorCasa"
    ).textContent =
        formatarMoeda(casa);


    document.getElementById(
        "valorOutros"
    ).textContent =
        formatarMoeda(outros);


    // =================================================
    // PORCENTAGENS
    // =================================================

    calcularPorcentagem(
        compras,
        totalDespesas,
        "porcentagemCompras",
        "barraCompras"
    );


    calcularPorcentagem(
        alimentacao,
        totalDespesas,
        "porcentagemAlimentacao",
        "barraAlimentacao"
    );


    calcularPorcentagem(
        casa,
        totalDespesas,
        "porcentagemCasa",
        "barraCasa"
    );


    calcularPorcentagem(
        outros,
        totalDespesas,
        "porcentagemOutros",
        "barraOutros"
    );


    // =================================================
    // RECEITAS POR CATEGORIA
    // =================================================

    const salario =
        somarCategoria(
            receitasDoMes,
            "Salário"
        );


    const investimento =
        somarCategoria(
            receitasDoMes,
            "Investimento"
        );


    const pix =
        somarCategoria(
            receitasDoMes,
            "Pix"
        );


    const outrasReceitas =
        somarCategoria(
            receitasDoMes,
            "Outros"
        );


    // =================================================
    // MOSTRAR RECEITAS POR CATEGORIA
    // =================================================

    document.getElementById(
        "valorSalario"
    ).textContent =
        formatarMoeda(salario);


    document.getElementById(
        "valorInvestimento"
    ).textContent =
        formatarMoeda(investimento);


    document.getElementById(
        "valorPix"
    ).textContent =
        formatarMoeda(pix);


    document.getElementById(
        "valorOutrasReceitas"
    ).textContent =
        formatarMoeda(outrasReceitas);


    document.getElementById(
        "totalReceitasCategoria"
    ).textContent =
        formatarMoeda(totalReceitas);


    // =================================================
    // ATUALIZA GRÁFICO
    // =================================================

    atualizarGraficoContas(
        compras,
        alimentacao,
        casa,
        outros
    );
}


// =====================================================
// QUANDO A PÁGINA CARREGAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        atualizarContas();

    }
);


