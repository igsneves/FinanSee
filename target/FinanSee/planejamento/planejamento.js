let graficoEvolucao = null;


// =====================================================
// ATUALIZAR GRÁFICO
// =====================================================

async function atualizarGraficoEvolucao() {

    console.log(
        "Carregando planejamento financeiro..."
    );


    try {

        // =================================================
        // BUSCAR RECEITAS E DESPESAS NO MYSQL
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
            "Receitas recebidas:",
            receitas
        );


        console.log(
            "Despesas recebidas:",
            despesas
        );


        // =================================================
        // MESES
        // =================================================

        const meses = [
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


        // =================================================
        // ANO ATUAL
        // =================================================

        const anoAtual =
            new Date().getFullYear();


        // =================================================
        // ARRAYS DOS 12 MESES
        // =================================================

        const receitasPorMes =
            new Array(12).fill(0);


        const despesasPorMes =
            new Array(12).fill(0);


        // =================================================
        // SEPARAR RECEITAS POR MÊS
        // =================================================

        receitas.forEach(
            receita => {

                if (!receita.data) {
                    return;
                }


                // Exemplo:
                // 2026-09-19

                const partes =
                    receita.data.split("-");


                if (partes.length !== 3) {
                    return;
                }


                const ano =
                    Number(partes[0]);


                const mes =
                    Number(partes[1]) - 1;


                if (
                    ano === anoAtual &&
                    mes >= 0 &&
                    mes <= 11
                ) {

                    receitasPorMes[mes] +=
                        Number(
                            receita.valor || 0
                        );
                }
            }
        );


        // =================================================
        // SEPARAR DESPESAS POR MÊS
        // =================================================

        despesas.forEach(
            despesa => {

                if (!despesa.data) {
                    return;
                }


                const partes =
                    despesa.data.split("-");


                if (partes.length !== 3) {
                    return;
                }


                const ano =
                    Number(partes[0]);


                const mes =
                    Number(partes[1]) - 1;


                if (
                    ano === anoAtual &&
                    mes >= 0 &&
                    mes <= 11
                ) {

                    despesasPorMes[mes] +=
                        Number(
                            despesa.valor || 0
                        );
                }
            }
        );


        // =================================================
        // CALCULAR SALDO DE CADA MÊS
        // =================================================

        const saldoPorMes = [];


        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const resultadoMes =
                receitasPorMes[i] -
                despesasPorMes[i];


            saldoPorMes.push(
                Number(
                    resultadoMes.toFixed(2)
                )
            );
        }


        // =================================================
        // PEGAR CANVAS
        // =================================================

        const canvas =
            document.getElementById(
                "graficoEvolucao"
            );


        if (!canvas) {

            console.error(
                "Canvas #graficoEvolucao não encontrado."
            );

            return;
        }


        // =================================================
        // DESTRUIR GRÁFICO ANTERIOR
        // =================================================

        if (graficoEvolucao) {

            graficoEvolucao.destroy();

            graficoEvolucao = null;
        }


        // =================================================
        // CRIAR GRADIENTE
        // =================================================

        const contexto =
            canvas.getContext("2d");


        const gradiente =
            contexto.createLinearGradient(
                0,
                0,
                0,
                400
            );


        gradiente.addColorStop(
            0,
            "rgba(0, 174, 255, 0.35)"
        );


        gradiente.addColorStop(
            1,
            "rgba(0, 174, 255, 0.02)"
        );


        // =================================================
        // CRIAR GRÁFICO
        // =================================================

        graficoEvolucao =
            new Chart(
                canvas,
                {

                    type: "line",


                    data: {

                        labels: meses,


                        datasets: [

                            {

                                label:
                                    "Saldo mensal",

                                data:
                                    saldoPorMes,

                                borderColor:
                                    "#00aeff",

                                backgroundColor:
                                    gradiente,

                                borderWidth:
                                    3,

                                fill:
                                    true,

                                tension:
                                    0.4,

                                pointRadius:
                                    4,

                                pointHoverRadius:
                                    7,

                                pointBackgroundColor:
                                    "#00aeff",

                                pointBorderColor:
                                    "#ffffff",

                                pointBorderWidth:
                                    2
                            }
                        ]
                    },


                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,


                        interaction: {

                            intersect:
                                false,

                            mode:
                                "index"
                        },


                        plugins: {

                            legend: {

                                display:
                                    false
                            },


                            tooltip: {

                                callbacks: {

                                    label:
                                        function (
                                            context
                                        ) {

                                            const valor =
                                                Number(
                                                    context.raw || 0
                                                );


                                            return (
                                                "Saldo: " +
                                                valor.toLocaleString(
                                                    "pt-BR",
                                                    {
                                                        style:
                                                            "currency",

                                                        currency:
                                                            "BRL"
                                                    }
                                                )
                                            );
                                        }
                                }
                            }
                        },


                        scales: {

                            x: {

                                grid: {

                                    display:
                                        false
                                },


                                ticks: {

                                    color:
                                        "#777",

                                    font: {

                                        size:
                                            12
                                    }
                                }
                            },


                            y: {

                                beginAtZero:
                                    true,


                                ticks: {

                                    color:
                                        "#777",


                                    callback:
                                        function (
                                            value
                                        ) {

                                            return Number(
                                                value
                                            ).toLocaleString(
                                                "pt-BR",
                                                {
                                                    style:
                                                        "currency",

                                                    currency:
                                                        "BRL",

                                                    maximumFractionDigits:
                                                        0
                                                }
                                            );
                                        }
                                },


                                grid: {

                                    color:
                                        "rgba(0, 0, 0, 0.06)"
                                }
                            }
                        }
                    }
                }
            );


        // =================================================
        // CONFERÊNCIA
        // =================================================

        console.log(
            "Ano:",
            anoAtual
        );


        console.log(
            "Receitas por mês:",
            receitasPorMes
        );


        console.log(
            "Despesas por mês:",
            despesasPorMes
        );


        console.log(
            "Saldo por mês:",
            saldoPorMes
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar planejamento:",
            erro
        );
    }
}


// =====================================================
// EXECUTAR AO CARREGAR A PÁGINA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        atualizarGraficoEvolucao();

    }
);