let graficoDespesas = null;


// =====================================================
// ATUALIZAR GRÁFICO
// =====================================================

async function atualizarGraficoDespesas() {

    console.log(
        "ATUALIZANDO GRÁFICO PELO MYSQL..."
    );


    // =================================================
    // MÊS E ANO SELECIONADOS
    // =================================================

    let mes = new Date().getMonth();
    let ano = new Date().getFullYear();

    if (typeof mesSelecionado !== "undefined") {
        mes = mesSelecionado;
    }

    if (typeof anoSelecionado !== "undefined") {
        ano = anoSelecionado;
    }


    const mesFormatado =
        String(mes + 1).padStart(2, "0");

    const periodoSelecionado =
        `${ano}-${mesFormatado}`;


    console.log(
        "Gráfico mostrando:",
        periodoSelecionado
    );


    try {

        // =================================================
        // BUSCA RECEITAS E DESPESAS NO BACKEND
        // =================================================

        const [
            respostaReceitas,
            respostaDespesas
        ] = await Promise.all([

            fetch("../receita"),

            fetch("../despesa")

        ]);


        // =================================================
        // VERIFICA SESSÃO
        // =================================================

        if (
            respostaReceitas.status === 401 ||
            respostaDespesas.status === 401
        ) {

            console.warn(
                "Sessão expirada."
            );

            window.location.href =
                "../TelaInicial/index.html";

            return;
        }


        // =================================================
        // VERIFICA ERROS
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
        // CONVERTE PARA JSON
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
        // FILTRA RECEITAS PELO MÊS
        // =================================================

        const receitasDoMes =
            receitas.filter(receita => {

                return (
                    receita.data &&
                    receita.data.startsWith(
                        periodoSelecionado
                    )
                );

            });


        // =================================================
        // FILTRA DESPESAS PELO MÊS
        // =================================================

        const despesasDoMes =
            despesas.filter(despesa => {

                return (
                    despesa.data &&
                    despesa.data.startsWith(
                        periodoSelecionado
                    )
                );

            });


        // =================================================
        // SOMA RECEITAS
        // =================================================

        const totalReceitas =
            receitasDoMes.reduce(
                (total, receita) => {

                    return (
                        total +
                        Number(receita.valor || 0)
                    );

                },
                0
            );


        // =================================================
        // SOMA DESPESAS
        // =================================================

        const totalDespesas =
            despesasDoMes.reduce(
                (total, despesa) => {

                    return (
                        total +
                        Number(despesa.valor || 0)
                    );

                },
                0
            );


        console.log(
            "Total receitas do gráfico:",
            totalReceitas
        );

        console.log(
            "Total despesas do gráfico:",
            totalDespesas
        );


        // =================================================
        // CANVAS
        // =================================================

        const canvas =
            document.getElementById(
                "graficoDespesas"
            );

        if (!canvas) {

            console.warn(
                "Canvas graficoDespesas não encontrado."
            );

            return;
        }


        // =================================================
        // DESTROI GRÁFICO ANTERIOR
        // =================================================

        if (graficoDespesas) {

            graficoDespesas.destroy();

        }


        // =================================================
        // CRIA NOVO GRÁFICO
        // =================================================

        graficoDespesas =
            new Chart(
                canvas,
                {

                    type: "pie",

                    data: {

                        labels: [
                            "Receitas",
                            "Despesas"
                        ],

                        datasets: [

                            {

                                data: [
                                    totalReceitas,
                                    totalDespesas
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

                                            const valor =
                                                Number(
                                                    context.raw
                                                );

                                            return (
                                                context.label +
                                                ": " +
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
                        }
                    }
                }
            );


    } catch (erro) {

        console.error(
            "Erro ao atualizar gráfico:",
            erro
        );
    }
}


// =====================================================
// QUANDO A PÁGINA CARREGAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        atualizarGraficoDespesas();

    }
);