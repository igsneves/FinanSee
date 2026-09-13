
const mesesNomes = [
    "JAN", "FEV", "MAR", "ABR",
    "MAI", "JUN", "JUL", "AGO",
    "SET", "OUT", "NOV", "DEZ"
];

const hoje = new Date();

const mesAtual = hoje.getMonth();
const anoAtual = hoje.getFullYear();


// =====================================================
// MÊS SELECIONADO
// =====================================================

let mesSelecionado = mesAtual;
let anoSelecionado = anoAtual;


// =====================================================
// ELEMENTOS
// =====================================================

const btnMes = document.getElementById("btnMes");
const container = document.getElementById("meses");
const acoes = document.querySelector(".acoes");

const btnCancelar = document.getElementById("btnCancelar");
const btnAtual = document.getElementById("btnAtual");


// =====================================================
// MOSTRA O MÊS ATUAL
// =====================================================

btnMes.textContent =
    mesesNomes[mesAtual] + " " + anoAtual;


// =====================================================
// RENDERIZAR MESES
// =====================================================

mesesNomes.forEach((mes, i) => {

    const div = document.createElement("div");

    div.textContent = mes;

    div.classList.add("mes");


    // Marca o mês atual
    if (i === mesAtual) {

        div.classList.add("atual");

    }


    // =================================================
    // QUANDO CLICAR EM UM MÊS
    // =================================================

    div.addEventListener("click", () => {

        // Remove seleção anterior
        document
            .querySelectorAll(".mes")
            .forEach(m => m.classList.remove("atual"));


        // Marca o mês selecionado
        div.classList.add("atual");


        // Salva o mês selecionado
        mesSelecionado = i;
        anoSelecionado = anoAtual;


        // Atualiza o botão
        btnMes.textContent =
            mesesNomes[i] + " " + anoSelecionado;


        // Fecha calendário
        container.style.display = "none";
        acoes.style.display = "none";


        // =================================================
        // ATUALIZA OS CARDS
        // =================================================

        if (typeof atualizarResumo === "function") {
            atualizarResumo();
        }

        if (typeof atualizarGraficoDespesas === "function") {
            atualizarGraficoDespesas();
        }

    });


    container.appendChild(div);

});


// =====================================================
// ABRIR / FECHAR MESES
// =====================================================

btnMes.addEventListener("click", () => {

    if (container.style.display === "grid") {

        container.style.display = "none";
        acoes.style.display = "none";

    } else {

        container.style.display = "grid";
        acoes.style.display = "flex";

    }

});


// =====================================================
// BOTÃO MÊS ATUAL
// =====================================================

btnAtual.addEventListener("click", () => {


    // Volta para o mês atual
    mesSelecionado = mesAtual;
    anoSelecionado = anoAtual;


    // Atualiza visualmente
    document
        .querySelectorAll(".mes")
        .forEach((m, i) => {

            m.classList.remove("atual");

            if (i === mesAtual) {

                m.classList.add("atual");

            }

        });


    // Atualiza botão
    btnMes.textContent =
        mesesNomes[mesAtual] + " " + anoAtual;


    // Fecha calendário
    container.style.display = "none";
    acoes.style.display = "none";


    // Atualiza os cards
    // Atualiza os cards
    if (typeof atualizarResumo === "function") {

        atualizarResumo();

    }

    // Atualiza o gráfico
    if (typeof atualizarGraficoDespesas === "function") {

        atualizarGraficoDespesas();

    }

    });


// =====================================================
// BOTÃO CANCELAR
// =====================================================

btnCancelar.addEventListener("click", () => {

    container.style.display = "none";
    acoes.style.display = "none";

});




