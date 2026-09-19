
function formatarMoeda(valor) {

    return Number(valor).toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}


function atualizarValores() {

    const usuario =
        localStorage.getItem("usuarioLogado");


    if (!usuario) {

        console.log("Nenhum usuário logado.");

        return;

    }


    let dados =
        JSON.parse(localStorage.getItem("dadosFinanceiros")) || {};


    if (!dados[usuario]) {

        dados[usuario] = {

            receitas: 0,
            despesas: 0,
            saldo: 0,
            cartao: 0

        };

        localStorage.setItem(
            "dadosFinanceiros",
            JSON.stringify(dados)
        );

    }


    const financeiro = dados[usuario];


    const saldo = document.getElementById("saldoAtual");

    const receitas = document.getElementById("totalReceitas");

    const despesas = document.getElementById("totalDespesas");

    const cartao = document.getElementById("totalCartao");


    if (saldo) {

        saldo.textContent =
            formatarMoeda(financeiro.saldo);

    }


    if (receitas) {

        receitas.textContent =
            formatarMoeda(financeiro.receitas);

    }


    if (despesas) {

        despesas.textContent =
            formatarMoeda(financeiro.despesas);

    }


    if (cartao) {

        cartao.textContent =
            formatarMoeda(financeiro.cartao);

    }

}


document.addEventListener(
    "DOMContentLoaded",
    atualizarValores
);
