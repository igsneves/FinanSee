let graficoDespesasCategoria = null;


// =====================================================
// FORMATAR VALOR EM REAL
// =====================================================

function formatarMoeda(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


// =====================================================
// NOMES DOS MESES
// =====================================================

const mesesContas = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ"
];


// =====================================================
// OBTER PERÍODO SELECIONADO
// =====================================================

function obterPeriodoSelecionado() {

    const hoje = new Date();

    let mes =
        hoje.getMonth();

    let ano =
        hoje.getFullYear();


    const mesSalvo =
        localStorage.getItem(
            "mesSelecionado"
        );


    if (mesSalvo) {

        try {

            const dadosMes =
                JSON.parse(mesSalvo);


            if (
                typeof dadosMes.mes === "number" &&
                typeof dadosMes.ano === "number" &&
                dadosMes.mes >= 0 &&
                dadosMes.mes <= 11
            ) {

                mes =
                    dadosMes.mes;

                ano =
                    dadosMes.ano;
            }

        } catch (erro) {

            console.error(
                "Erro ao recuperar mês:",
                erro
            );
        }
    }


    return {
        mes: mes,
        ano: ano,

        periodo:
            `${ano}-${String(
                mes + 1
            ).padStart(2, "0")}`
    };
}


// =====================================================
// ATUALIZAR TÍTULO DO MÊS
// =====================================================

function atualizarTituloMes(
    mes,
    ano
) {

    const elemento =
        document.getElementById(
            "mesAtualContas"
        );


    if (!elemento) {
        return;
    }


    elemento.textContent =
        `${mesesContas[mes]} ${ano}`;
}


// =====================================================
// SOMAR CATEGORIA
// =====================================================

function somarCategoria(
    lista,
    categoria
) {

    return lista.reduce(
        (total, item) => {

            const categoriaItem =
                String(
                    item.categoria || ""
                )
                    .trim()
                    .toLowerCase();


            const categoriaProcurada =
                String(categoria)
                    .trim()
                    .toLowerCase();


            if (
                categoriaItem ===
                categoriaProcurada
            ) {

                return (
                    total +
                    Number(
                        item.valor || 0
                    )
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

        graficoDespesasCategoria =
            null;
    }


    // Cria novo gráfico

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
// ZERAR PÁGINA
// =====================================================

function zerarPaginaContas() {

    const idsValores = [
        "saldoContas",
        "totalReceitasContas",
        "totalDespesasContas",

        "valorCompras",
        "valorAlimentacao",
        "valorCasa",
        "valorOutros",

        "valorSalario",
        "valorInvestimento",
        "valorPix",
        "valorOutrasReceitas",

        "totalReceitasCategoria"
    ];


    idsValores.forEach(
        function (id) {

            const elemento =
                document.getElementById(id);

            if (elemento) {

                elemento.textContent =
                    "R$ 0,00";
            }
        }
    );


    calcularPorcentagem(
        0,
        0,
        "porcentagemCompras",
        "barraCompras"
    );

    calcularPorcentagem(
        0,
        0,
        "porcentagemAlimentacao",
        "barraAlimentacao"
    );

    calcularPorcentagem(
        0,
        0,
        "porcentagemCasa",
        "barraCasa"
    );

    calcularPorcentagem(
        0,
        0,
        "porcentagemOutros",
        "barraOutros"
    );


    atualizarGraficoContas(
        0,
        0,
        0,
        0
    );
}


// =====================================================
// ATUALIZAR PÁGINA CONTAS
// =====================================================

async function atualizarContas() {

    console.log(
        "================================="
    );

    console.log(
        "ATUALIZANDO CONTAS PELO MYSQL..."
    );

    console.log(
        "================================="
    );


    // =================================================
    // PERÍODO SELECIONADO
    // =================================================

    const periodo =
        obterPeriodoSelecionado();


    atualizarTituloMes(
        periodo.mes,
        periodo.ano
    );


    console.log(
        "Mês analisado:",
        periodo.periodo
    );


    try {

        // =================================================
        // BUSCAR DADOS NO BACKEND
        // =================================================

        const [
            respostaReceitas,
            respostaDespesas
        ] = await Promise.all([

            fetch("../receita"),

            fetch("../despesa")
        ]);


        // =================================================
        // VERIFICAR SESSÃO
        // =================================================

        if (
            respostaReceitas.status === 401 ||
            respostaDespesas.status === 401
        ) {

            console.warn(
                "Usuário não está logado."
            );


            window.location.href =
                "../TelaInicial/index.html";


            return;
        }


        // =================================================
        // VERIFICAR ERROS
        // =================================================

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


        // =================================================
        // CONVERTER RESPOSTAS PARA JSON
        // =================================================

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


        // =================================================
        // FILTRAR RECEITAS PELO MÊS
        // =================================================

        const receitasDoMes =
            receitas.filter(
                receita => {

                    return (
                        receita.data &&
                        receita.data.startsWith(
                            periodo.periodo
                        )
                    );
                }
            );


        // =================================================
        // FILTRAR DESPESAS PELO MÊS
        // =================================================

        const despesasDoMes =
            despesas.filter(
                despesa => {

                    return (
                        despesa.data &&
                        despesa.data.startsWith(
                            periodo.periodo
                        )
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
        // ATUALIZAR CARDS
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
                formatarMoeda(
                    totalReceitas
                );
        }


        if (despesasElement) {

            despesasElement.textContent =
                formatarMoeda(
                    totalDespesas
                );
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


        // =================================================
        // MOSTRAR DESPESAS
        // =================================================

        const valorCompras =
            document.getElementById(
                "valorCompras"
            );

        const valorAlimentacao =
            document.getElementById(
                "valorAlimentacao"
            );

        const valorCasa =
            document.getElementById(
                "valorCasa"
            );

        const valorOutros =
            document.getElementById(
                "valorOutros"
            );


        if (valorCompras) {

            valorCompras.textContent =
                formatarMoeda(compras);
        }


        if (valorAlimentacao) {

            valorAlimentacao.textContent =
                formatarMoeda(
                    alimentacao
                );
        }


        if (valorCasa) {

            valorCasa.textContent =
                formatarMoeda(casa);
        }


        if (valorOutros) {

            valorOutros.textContent =
                formatarMoeda(outros);
        }


        // =================================================
        // PORCENTAGENS DAS DESPESAS
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
        // MOSTRAR RECEITAS
        // =================================================

        const valorSalario =
            document.getElementById(
                "valorSalario"
            );


        const valorInvestimento =
            document.getElementById(
                "valorInvestimento"
            );


        const valorPix =
            document.getElementById(
                "valorPix"
            );


        const valorOutrasReceitas =
            document.getElementById(
                "valorOutrasReceitas"
            );


        const totalReceitasCategoria =
            document.getElementById(
                "totalReceitasCategoria"
            );


        if (valorSalario) {

            valorSalario.textContent =
                formatarMoeda(salario);
        }


        if (valorInvestimento) {

            valorInvestimento.textContent =
                formatarMoeda(
                    investimento
                );
        }


        if (valorPix) {

            valorPix.textContent =
                formatarMoeda(pix);
        }


        if (valorOutrasReceitas) {

            valorOutrasReceitas.textContent =
                formatarMoeda(
                    outrasReceitas
                );
        }


        if (totalReceitasCategoria) {

            totalReceitasCategoria.textContent =
                formatarMoeda(
                    totalReceitas
                );
        }


        // =================================================
        // ATUALIZAR GRÁFICO
        // =================================================

        atualizarGraficoContas(
            compras,
            alimentacao,
            casa,
            outros
        );


        console.log(
            "Página Contas atualizada com sucesso."
        );


    } catch (erro) {

        console.error(
            "Erro ao atualizar página Contas:",
            erro
        );


        zerarPaginaContas();
    }
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

