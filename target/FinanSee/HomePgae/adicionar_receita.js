// =====================================================
// FUNÇÕES PARA ABRIR E FECHAR MODAIS
// =====================================================

function showModal(id = "modal") {
    const element = document.getElementById(id);

    if (element) {
        element.classList.add("show-modal");
    }
}

function hideModal(id = "modal") {
    const element = document.getElementById(id);

    if (element) {
        element.classList.remove("show-modal");
    }
}


// =====================================================
// DATA DO MÊS SELECIONADO
// =====================================================

function obterDataSelecionada() {

    const hoje = new Date();

    const ano = anoSelecionado;
    const mes = mesSelecionado + 1;

    let dia = hoje.getDate();

    const ultimoDiaDoMes =
        new Date(ano, mes, 0).getDate();

    if (dia > ultimoDiaDoMes) {
        dia = ultimoDiaDoMes;
    }

    return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}


// =====================================================
// OBTÉM A CATEGORIA DO DROPDOWN
// =====================================================

function obterCategoriaDropdown(formularioId) {

    const formulario =
        document.getElementById(formularioId);

    if (!formulario) {
        return "Outros";
    }

    const selectedOption =
        formulario.querySelector(".selectedOption");

    if (!selectedOption) {
        return "Outros";
    }

    return selectedOption.dataset.categoria || "Outros";
}


// =====================================================
// ESPERA A PÁGINA CARREGAR
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log(
        "adicionar_receita.js carregado com sucesso!"
    );


    // =================================================
    // BOTÃO NOVA RECEITA
    // =================================================

    const btnNovaReceita =
        document.getElementById("btn_NovaReceita");

    if (btnNovaReceita) {

        btnNovaReceita.addEventListener("click", function () {

            hideModal("modal");
            showModal("modalReceita");

        });
    }


    // =================================================
    // BOTÃO NOVA DESPESA
    // =================================================

    const btnNovaDespesa =
        document.getElementById("btn_NovaDespesa");

    if (btnNovaDespesa) {

        btnNovaDespesa.addEventListener("click", function () {

            hideModal("modal");
            showModal("modalDespesa");

        });
    }


    // =================================================
    // BOTÃO ADICIONAR RECEITA DO DASHBOARD
    // =================================================

    const btnAdicionarReceita =
        document.getElementById("btnAdicionarReceita");

    if (btnAdicionarReceita) {

        btnAdicionarReceita.addEventListener("click", function () {

            showModal("modalReceita");

        });
    }


    // =================================================
    // FORMULÁRIO DE RECEITA
    // =================================================

    const formReceita =
        document.getElementById("formReceita");

    if (formReceita) {

        formReceita.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                console.log(
                    "SALVAR RECEITA FOI CLICADO!"
                );


                // =========================================
                // CAMPOS
                // =========================================

                const descricaoElement =
                    document.getElementById(
                        "descricaoReceita"
                    );

                const valorElement =
                    document.getElementById(
                        "valorReceita"
                    );

                const descricao =
                    descricaoElement.value.trim();

                const valor =
                    parseFloat(valorElement.value);


                // =========================================
                // VALIDAÇÃO
                // =========================================

                if (descricao === "") {

                    alert(
                        "Digite uma descrição."
                    );

                    return;
                }

                if (isNaN(valor) || valor <= 0) {

                    alert(
                        "Digite um valor válido."
                    );

                    return;
                }


                // =========================================
                // DATA
                // =========================================

                const dataSelecionada =
                    obterDataSelecionada();



                // CATEGORIA
                // =========================================

                const categoria =
                    obterCategoriaDropdown(
                        "formReceita"
                    );

                console.log(
                    "Categoria selecionada:",
                    categoria
                );       

                // =========================================
                // PREPARA OS DADOS
                // =========================================
                
                const dados = new URLSearchParams();

                dados.append("descricao", descricao);
                dados.append("valor", valor.toString());
                dados.append("data", dataSelecionada);
                dados.append("categoria", categoria);


                // =========================================
                // ENVIA PARA O RECEITASERVLET
                // =========================================

                try {

                    const resposta =
                        await fetch("../receita", {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded"
                            },

                            body: dados.toString()
                        });


                    const mensagem =
                        await resposta.text();


                    // =====================================
                    // SESSÃO NÃO EXISTE
                    // =====================================

                    if (resposta.status === 401) {

                        alert(
                            "Sua sessão expirou. Faça login novamente."
                        );

                        window.location.href =
                            "../TelaInicial/index.html";

                        return;
                    }


                    // =====================================
                    // ERRO
                    // =====================================

                    if (!resposta.ok) {

                        console.error(
                            "Erro ao cadastrar receita:",
                            mensagem
                        );

                        alert(mensagem);

                        return;
                    }


                    // =====================================
                    // SUCESSO
                    // =====================================

                    console.log(
                        console.log(
                            "Despesa salva no MySQL com sucesso!"
                        ));

                        descricaoElement.value = "";
                        valorElement.value = "";

                        hideModal(
                            "modalDespesa"
                        );

                        // ATUALIZA OS CARDS AUTOMATICAMENTE
                        await atualizarResumo();
                        await atualizarGraficoDespesas();

                        alert(mensagem);


                } catch (erro) {

                    console.error(
                        "Erro ao conectar com o servidor:",
                        erro
                    );

                    alert(
                        "Erro ao conectar com o servidor."
                    );
                }
            }
        );

    } else {

    console.error(
        "ERRO: O formulário formReceita não foi encontrado."
    );
}


// =================================================
// FORMULÁRIO DE DESPESA
// =================================================

const formDespesa =
    document.getElementById("formDespesa");

if (formDespesa) {

    formDespesa.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log(
                "SALVAR DESPESA FOI CLICADO!"
            );


            // =========================================
            // CAMPOS
            // =========================================

            const descricaoElement =
                document.getElementById(
                    "descricaoDespesa"
                );

            const valorElement =
                document.getElementById(
                    "valorDespesa"
                );

            const descricao =
                descricaoElement.value.trim();

            const valor =
                parseFloat(valorElement.value);


            // =========================================
            // VALIDAÇÃO
            // =========================================

            if (descricao === "") {

                alert(
                    "Digite uma descrição."
                );

                return;
            }

            if (isNaN(valor) || valor <= 0) {

                alert(
                    "Digite um valor válido."
                );

                return;
            }


            // =========================================
            // DATA
            // =========================================

            const dataSelecionada =
                obterDataSelecionada();


            // =========================================
            // CATEGORIA
            // =========================================

            const categoria =
                obterCategoriaDropdown(
                    "formDespesa"
                );

            console.log(
                "Categoria da despesa:",
                categoria
            );


            // =========================================
            // PREPARA OS DADOS
            // =========================================

            const dados =
                new URLSearchParams();

            dados.append(
                "descricao",
                descricao
            );

            dados.append(
                "valor",
                valor.toString()
            );

            dados.append(
                "data",
                dataSelecionada
            );

            dados.append(
                "categoria",
                categoria
            );


            // =========================================
            // ENVIA PARA O DESPESASERVLET
            // =========================================

            try {

                const resposta =
                    await fetch(
                        "../despesa",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded"
                            },

                            body:
                                dados.toString()
                        }
                    );


                const mensagem =
                    await resposta.text();


                // =====================================
                // SESSÃO EXPIRADA
                // =====================================

                if (resposta.status === 401) {

                    alert(
                        "Sua sessão expirou. Faça login novamente."
                    );

                    window.location.href =
                        "../TelaInicial/index.html";

                    return;
                }


                // =====================================
                // ERRO
                // =====================================

                if (!resposta.ok) {

                    console.error(
                        "Erro ao cadastrar despesa:",
                        mensagem
                    );

                    alert(mensagem);

                    return;
                }


                // =====================================
                // SUCESSO
                // =====================================

                console.log(
                        "Receita salva no MySQL com sucesso!"
                    );

                    descricaoElement.value = "";
                    valorElement.value = "";

                    hideModal("modalReceita");

                    // ATUALIZA OS CARDS AUTOMATICAMENTE
                    await atualizarResumo();
                    await atualizarGraficoDespesas();

                    alert(mensagem);

            } catch (erro) {

                console.error(
                    "Erro ao conectar com o servidor:",
                    erro
                );

                alert(
                    "Erro ao conectar com o servidor."
                );
            }
        }
    );

} else {

    console.error(
        "ERRO: O formulário formDespesa não foi encontrado."
    );
}


});