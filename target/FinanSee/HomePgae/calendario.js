// =====================================================
// CALENDÁRIO - SELEÇÃO DE MÊS
// =====================================================


// =====================================================
// NOMES DOS MESES
// =====================================================

const mesesNomes = [
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
// DATA ATUAL
// =====================================================

const hoje = new Date();

const mesAtual =
    hoje.getMonth();

const anoAtual =
    hoje.getFullYear();


// =====================================================
// MÊS E ANO SELECIONADOS
// =====================================================

let mesSelecionado =
    mesAtual;

let anoSelecionado =
    anoAtual;


// =====================================================
// RECUPERA O ÚLTIMO MÊS SELECIONADO
// =====================================================

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

            mesSelecionado =
                dadosMes.mes;

            anoSelecionado =
                dadosMes.ano;

        }

    } catch (erro) {

        console.error(
            "Erro ao recuperar mês selecionado:",
            erro
        );

        mesSelecionado =
            mesAtual;

        anoSelecionado =
            anoAtual;
    }
}


// =====================================================
// ELEMENTOS DO HTML
// =====================================================

const btnMes =
    document.getElementById(
        "btnMes"
    );

const container =
    document.getElementById(
        "meses"
    );

const acoes =
    document.querySelector(
        ".acoes"
    );

const btnCancelar =
    document.getElementById(
        "btnCancelar"
    );

const btnAtual =
    document.getElementById(
        "btnAtual"
    );


// =====================================================
// SALVAR MÊS SELECIONADO
// =====================================================

function salvarMesSelecionado() {

    localStorage.setItem(
        "mesSelecionado",
        JSON.stringify({
            mes: mesSelecionado,
            ano: anoSelecionado
        })
    );
}


// =====================================================
// ATUALIZAR TEXTO DO BOTÃO
// =====================================================

function atualizarBotaoMes() {

    if (!btnMes) {
        return;
    }

    btnMes.textContent =
        mesesNomes[mesSelecionado] +
        " " +
        anoSelecionado;
}


// =====================================================
// FECHAR CALENDÁRIO
// =====================================================

function fecharCalendario() {

    if (container) {
        container.style.display =
            "none";
    }

    if (acoes) {
        acoes.style.display =
            "none";
    }
}


// =====================================================
// ATUALIZAR DADOS DA HOME
// =====================================================

async function atualizarDadosDoMes() {

    console.log(
        "Atualizando dados do mês:",
        mesesNomes[mesSelecionado],
        anoSelecionado
    );


    // -------------------------------------------------
    // ATUALIZA CARDS
    // -------------------------------------------------

    if (
        typeof atualizarResumo ===
        "function"
    ) {

        try {

            await atualizarResumo();

        } catch (erro) {

            console.error(
                "Erro ao atualizar resumo:",
                erro
            );
        }
    }


    // -------------------------------------------------
    // ATUALIZA GRÁFICO
    // -------------------------------------------------

    if (
        typeof atualizarGraficoDespesas ===
        "function"
    ) {

        try {

            await atualizarGraficoDespesas();

        } catch (erro) {

            console.error(
                "Erro ao atualizar gráfico:",
                erro
            );
        }
    }
}


// =====================================================
// MARCAR MÊS VISUALMENTE
// =====================================================

function marcarMesSelecionado() {

    document
        .querySelectorAll(".mes")
        .forEach(
            (elementoMes, indice) => {

                elementoMes.classList.remove(
                    "atual"
                );

                if (
                    indice ===
                    mesSelecionado
                ) {

                    elementoMes.classList.add(
                        "atual"
                    );
                }
            }
        );
}


// =====================================================
// CONFIGURA O BOTÃO INICIAL
// =====================================================

atualizarBotaoMes();


// =====================================================
// CRIAR OS MESES NO CALENDÁRIO
// =====================================================

if (container) {

    container.innerHTML = "";

    mesesNomes.forEach(
        (nomeMes, indice) => {

            const div =
                document.createElement(
                    "div"
                );

            div.textContent =
                nomeMes;

            div.classList.add(
                "mes"
            );


            // -----------------------------------------
            // MARCA O MÊS SELECIONADO
            // -----------------------------------------

            if (
                indice ===
                mesSelecionado
            ) {

                div.classList.add(
                    "atual"
                );
            }


            // -----------------------------------------
            // CLIQUE NO MÊS
            // -----------------------------------------

            div.addEventListener(
                "click",
                async function () {

                    mesSelecionado =
                        indice;

                    /*
                     * Por enquanto o calendário
                     * trabalha com o ano atual.
                     */
                    anoSelecionado =
                        anoAtual;


                    // Salva preferência
                    salvarMesSelecionado();


                    // Atualiza seleção visual
                    marcarMesSelecionado();


                    // Atualiza botão
                    atualizarBotaoMes();


                    // Fecha calendário
                    fecharCalendario();


                    // Atualiza cards + gráfico
                    await atualizarDadosDoMes();
                }
            );


            container.appendChild(
                div
            );
        }
    );
}


// =====================================================
// ABRIR / FECHAR CALENDÁRIO
// =====================================================

if (btnMes) {

    btnMes.addEventListener(
        "click",
        function () {

            if (!container) {
                return;
            }


            const estaAberto =
                container.style.display ===
                "grid";


            if (estaAberto) {

                fecharCalendario();

            } else {

                container.style.display =
                    "grid";

                if (acoes) {

                    acoes.style.display =
                        "flex";
                }
            }
        }
    );
}


// =====================================================
// BOTÃO MÊS ATUAL
// =====================================================

if (btnAtual) {

    btnAtual.addEventListener(
        "click",
        async function () {

            // -----------------------------------------
            // VOLTA PARA O MÊS ATUAL
            // -----------------------------------------

            mesSelecionado =
                mesAtual;

            anoSelecionado =
                anoAtual;


            // -----------------------------------------
            // SALVA A SELEÇÃO
            // -----------------------------------------

            salvarMesSelecionado();


            // -----------------------------------------
            // ATUALIZA VISUALMENTE
            // -----------------------------------------

            marcarMesSelecionado();


            // -----------------------------------------
            // ATUALIZA BOTÃO
            // -----------------------------------------

            atualizarBotaoMes();


            // -----------------------------------------
            // FECHA CALENDÁRIO
            // -----------------------------------------

            fecharCalendario();


            // -----------------------------------------
            // ATUALIZA CARDS + GRÁFICO
            // -----------------------------------------

            await atualizarDadosDoMes();
        }
    );
}


// =====================================================
// BOTÃO CANCELAR
// =====================================================

if (btnCancelar) {

    btnCancelar.addEventListener(
        "click",
        function () {

            fecharCalendario();

        }
    );
}




