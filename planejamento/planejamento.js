
let graficoEvolucao = null;


// =====================================================
// ATUALIZAR GRÁFICO
// =====================================================

function atualizarGraficoEvolucao() {

    // Pega o usuário logado
    const usuarioLogado =
        localStorage.getItem("usuarioLogado");

    // Pega os dados financeiros
    const dadosSalvos =
        localStorage.getItem("dadosFinanceiros");

    // Verifica se existem dados
    if (!usuarioLogado || !dadosSalvos) {
        console.log("Usuário ou dados financeiros não encontrados.");
        return;
    }

    let dadosFinanceiros;

    try {

        dadosFinanceiros =
            JSON.parse(dadosSalvos);

    } catch (erro) {

        console.error(
            "Erro ao ler dados financeiros:",
            erro
        );

        return;
    }


    // =====================================================
    // DADOS DO USUÁRIO
    // =====================================================

    const dadosUsuario =
        dadosFinanceiros[usuarioLogado];

    if (!dadosUsuario) {

        console.log(
            "Nenhum dado financeiro encontrado para este usuário."
        );

        return;
    }


    // Garante que sejam arrays
    const receitas =
        Array.isArray(dadosUsuario.receitas)
            ? dadosUsuario.receitas
            : [];

    const despesas =
        Array.isArray(dadosUsuario.despesas)
            ? dadosUsuario.despesas
            : [];


    // =====================================================
    // MESES
    // =====================================================

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


    // =====================================================
    // ANO ATUAL
    // =====================================================

    const anoAtual =
        new Date().getFullYear();


    // =====================================================
    // VALORES DE CADA MÊS
    // =====================================================

    const receitasPorMes =
        new Array(12).fill(0);

    const despesasPorMes =
        new Array(12).fill(0);


    // =====================================================
    // SEPARAR RECEITAS POR MÊS
    // =====================================================

    receitas.forEach(receita => {

        if (!receita.data) {
            return;
        }

        const data =
            new Date(receita.data + "T00:00:00");

        const ano =
            data.getFullYear();

        const mes =
            data.getMonth();


        // Considera somente o ano atual
        if (ano === anoAtual) {

            receitasPorMes[mes] +=
                Number(receita.valor || 0);
        }

    });


    // =====================================================
    // SEPARAR DESPESAS POR MÊS
    // =====================================================

    despesas.forEach(despesa => {

        if (!despesa.data) {
            return;
        }

        const data =
            new Date(despesa.data + "T00:00:00");

        const ano =
            data.getFullYear();

        const mes =
            data.getMonth();


        // Considera somente o ano atual
        if (ano === anoAtual) {

            despesasPorMes[mes] +=
                Number(despesa.valor || 0);
        }

    });


    // =====================================================
    // CALCULAR SALDO 
    // =====================================================

   let saldoPorMes = [];

for (let i = 0; i < 12; i++) {
    const resultadoMes =
        receitasPorMes[i] - despesasPorMes[i];

    saldoPorMes.push(Number(resultadoMes.toFixed(2)));
}


    // =====================================================
    // PEGAR CANVAS
    // =====================================================

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


    // =====================================================
    // DESTRUIR GRÁFICO ANTERIOR
    // =====================================================

    if (graficoEvolucao) {

        graficoEvolucao.destroy();

        graficoEvolucao = null;
    }


    // =====================================================
    // CRIAR GRADIENTE
    // =====================================================

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


    // =====================================================
    // CRIAR GRÁFICO
    // =====================================================

    graficoEvolucao =
        new Chart(canvas, {

            type: "line",

            data: {

                labels: meses,

                datasets: [{

                    label: "Saldo acumulado",

                    data: saldoPorMes,

                    borderColor: "#00aeff",

                    backgroundColor:
                        gradiente,

                    borderWidth: 3,

                    fill: true,

                    tension: 0.4,

                    pointRadius: 4,

                    pointHoverRadius: 7,

                    pointBackgroundColor:
                        "#00aeff",

                    pointBorderColor:
                        "#ffffff",

                    pointBorderWidth: 2
                }]
            },


            options: {

                responsive: true,

                maintainAspectRatio: false,


                interaction: {

                    intersect: false,

                    mode: "index"
                },


                plugins: {

                    legend: {

                        display: false
                    },


                    tooltip: {

                        callbacks: {

                            label: function(context) {

                                const valor =
                                    Number(
                                        context.raw || 0
                                    );

                                return "Saldo: R$ " +
                                    valor.toLocaleString(
                                        "pt-BR",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }
                                    );
                            }
                        }
                    }
                },


                scales: {

                    x: {

                        grid: {

                            display: false
                        },

                        ticks: {

                            color: "#777",

                            font: {

                                size: 12
                            }
                        }
                    },


                    y: {

                        beginAtZero: true,

                        ticks: {

                            color: "#777",

                            callback: function(value) {

                                return "R$ " +
                                    Number(value)
                                        .toLocaleString(
                                            "pt-BR",
                                            {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
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
        });


    // =====================================================
    // CONSOLE PARA CONFERÊNCIA
    // =====================================================

    console.log(
        "Receitas por mês:",
        receitasPorMes
    );

    console.log(
        "Despesas por mês:",
        despesasPorMes
    );

    console.log(
        "Saldo acumulado:",
        saldoPorMes
    );
}


// =====================================================
// EXECUTAR QUANDO A PÁGINA CARREGAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        atualizarGraficoEvolucao();

    }
);