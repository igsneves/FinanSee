let graficoDespesas = null;


function atualizarGraficoDespesas() {

    const usuarioLogado = localStorage.getItem("usuarioLogado");
    const dadosSalvos = localStorage.getItem("dadosFinanceiros");

    if (!usuarioLogado || !dadosSalvos) {
        return;
    }


    const dadosFinanceiros = JSON.parse(dadosSalvos);

    const dadosUsuario = dadosFinanceiros[usuarioLogado];

    if (!dadosUsuario) {
        return;
    }


    const receitas = dadosUsuario.receitas || [];
    const despesas = dadosUsuario.despesas || [];


    // ==========================================
    // MÊS SELECIONADO NO CALENDÁRIO
    // ==========================================

    const mes = String(mesSelecionado + 1).padStart(2, "0");

    const ano = String(anoSelecionado);

    const mesSelecionadoFormato = `${ano}-${mes}`;


    console.log(
        "Gráfico mostrando:",
        mesSelecionadoFormato
    );


    // ==========================================
    // FILTRA RECEITAS
    // ==========================================

    const receitasDoMes = receitas.filter(receita => {

        return receita.data &&
               receita.data.substring(0, 7) === mesSelecionadoFormato;

    });


    // ==========================================
    // FILTRA DESPESAS
    // ==========================================

    const despesasDoMes = despesas.filter(despesa => {

        return despesa.data &&
               despesa.data.substring(0, 7) === mesSelecionadoFormato;

    });


    // ==========================================
    // SOMA RECEITAS
    // ==========================================

    const totalReceitas = receitasDoMes.reduce(
        (total, receita) => {

            return total + Number(receita.valor || 0);

        },
        0
    );


    // ==========================================
    // SOMA DESPESAS
    // ==========================================

    const totalDespesas = despesasDoMes.reduce(
        (total, despesa) => {

            return total + Number(despesa.valor || 0);

        },
        0
    );


    console.log("Receitas:", totalReceitas);
    console.log("Despesas:", totalDespesas);


    // ==========================================
    // CANVAS
    // ==========================================

    const canvas = document.getElementById("graficoDespesas");

    if (!canvas) {
        return;
    }


    // ==========================================
    // DESTROI GRÁFICO ANTERIOR
    // ==========================================

    if (graficoDespesas) {

        graficoDespesas.destroy();

    }


    // ==========================================
    // CRIA GRÁFICO
    // ==========================================

    graficoDespesas = new Chart(canvas, {

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

                        label: function(context) {

                            const valor = context.raw;

                            return context.label +
                                ": R$ " +
                                valor.toLocaleString(
                                    "pt-BR",
                                    {
                                        minimumFractionDigits: 2
                                    }
                                );

                        }

                    }

                }

            }

        }

    });

}


// ==========================================
// QUANDO A PÁGINA CARREGAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        atualizarGraficoDespesas();

    }
);