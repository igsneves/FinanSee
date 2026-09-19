package br.finansee.controller;

import br.finansee.dao.DespesaDAO;
import br.finansee.model.Despesa;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@WebServlet("/despesa")
public class DespesaServlet extends HttpServlet {


    // =================================================
    // GET - LISTAR DESPESAS
    // =================================================

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws ServletException, IOException {

        response.setContentType(
                "application/json;charset=UTF-8"
        );

        HttpSession sessao =
                request.getSession(false);

        if (
            sessao == null ||
            sessao.getAttribute("usuarioId") == null
        ) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.getWriter().write(
                    "{\"erro\":\"Usuário não está logado.\"}"
            );

            return;
        }


        int usuarioId =
                (Integer) sessao.getAttribute(
                        "usuarioId"
                );


        DespesaDAO despesaDAO =
                new DespesaDAO();

        List<Despesa> despesas =
                despesaDAO.listarPorUsuario(
                        usuarioId
                );


        StringBuilder json =
                new StringBuilder();

        json.append("[");


        for (int i = 0; i < despesas.size(); i++) {

            Despesa despesa =
                    despesas.get(i);

            json.append("{");

            json.append("\"id\":")
                    .append(despesa.getId())
                    .append(",");

            json.append("\"descricao\":\"")
                    .append(
                            escaparJson(
                                    despesa.getDescricao()
                            )
                    )
                    .append("\",");

            json.append("\"valor\":")
                    .append(despesa.getValor())
                    .append(",");

            json.append("\"data\":\"")
                    .append(despesa.getData())
                    .append("\",");

            json.append("\"categoria\":\"")
                    .append(
                            escaparJson(
                                    despesa.getCategoria()
                            )
                    )
                    .append("\"");

            json.append("}");


            if (i < despesas.size() - 1) {
                json.append(",");
            }
        }


        json.append("]");


        response.setStatus(
                HttpServletResponse.SC_OK
        );

        response.getWriter().write(
                json.toString()
        );
    }


    // =================================================
    // POST - CADASTRAR DESPESA
    // =================================================

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");

        response.setContentType(
                "text/plain;charset=UTF-8"
        );


        HttpSession sessao =
                request.getSession(false);

        if (
            sessao == null ||
            sessao.getAttribute("usuarioId") == null
        ) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.getWriter().write(
                    "Usuário não está logado."
            );

            return;
        }


        int usuarioId =
                (Integer) sessao.getAttribute(
                        "usuarioId"
                );


        String descricao =
                request.getParameter("descricao");

        String valorTexto =
                request.getParameter("valor");

        String dataTexto =
                request.getParameter("data");

        String categoria =
                request.getParameter("categoria");


        if (
            descricao == null ||
            descricao.isBlank() ||

            valorTexto == null ||
            valorTexto.isBlank() ||

            dataTexto == null ||
            dataTexto.isBlank() ||

            categoria == null ||
            categoria.isBlank()
        ) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            response.getWriter().write(
                    "Preencha todos os dados da despesa."
            );

            return;
        }


        try {

            BigDecimal valor =
                    new BigDecimal(valorTexto);

            LocalDate data =
                    LocalDate.parse(dataTexto);


            if (
                valor.compareTo(
                        BigDecimal.ZERO
                ) <= 0
            ) {

                response.setStatus(
                        HttpServletResponse.SC_BAD_REQUEST
                );

                response.getWriter().write(
                        "O valor da despesa deve ser maior que zero."
                );

                return;
            }


            Despesa despesa =
                    new Despesa(
                            usuarioId,
                            descricao,
                            valor,
                            data,
                            categoria
                    );


            DespesaDAO despesaDAO =
                    new DespesaDAO();

            boolean cadastrado =
                    despesaDAO.cadastrar(
                            despesa
                    );


            if (cadastrado) {

                response.setStatus(
                        HttpServletResponse.SC_CREATED
                );

                response.getWriter().write(
                        "Despesa cadastrada com sucesso!"
                );

            } else {

                response.setStatus(
                        HttpServletResponse.SC_INTERNAL_SERVER_ERROR
                );

                response.getWriter().write(
                        "Não foi possível cadastrar a despesa."
                );
            }


        } catch (
                NumberFormatException |
                DateTimeParseException erro
        ) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            response.getWriter().write(
                    "Os dados da despesa são inválidos."
            );
        }
    }


    // =================================================
    // DELETE - EXCLUIR DESPESA
    // =================================================

    @Override
    protected void doDelete(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws ServletException, IOException {

        response.setContentType(
                "text/plain;charset=UTF-8"
        );


        // =============================================
        // VERIFICA SE O USUÁRIO ESTÁ LOGADO
        // =============================================

        HttpSession sessao =
                request.getSession(false);

        if (
            sessao == null ||
            sessao.getAttribute("usuarioId") == null
        ) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.getWriter().write(
                    "Usuário não está logado."
            );

            return;
        }


        // =============================================
        // PEGA O ID DO USUÁRIO DA SESSÃO
        // =============================================

        int usuarioId =
                (Integer) sessao.getAttribute(
                        "usuarioId"
                );


        // =============================================
        // PEGA O ID DA DESPESA
        // =============================================

        String idTexto =
                request.getParameter("id");


        if (
            idTexto == null ||
            idTexto.isBlank()
        ) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            response.getWriter().write(
                    "Informe o ID da despesa."
            );

            return;
        }


        try {

            int id =
                    Integer.parseInt(idTexto);


            // =========================================
            // VALIDA O ID
            // =========================================

            if (id <= 0) {

                response.setStatus(
                        HttpServletResponse.SC_BAD_REQUEST
                );

                response.getWriter().write(
                        "ID da despesa inválido."
                );

                return;
            }


            // =========================================
            // EXCLUI A DESPESA
            // =========================================

            DespesaDAO despesaDAO =
                    new DespesaDAO();


            boolean excluido =
                    despesaDAO.excluir(
                            id,
                            usuarioId
                    );


            // =========================================
            // RESPOSTA
            // =========================================

            if (excluido) {

                response.setStatus(
                        HttpServletResponse.SC_OK
                );

                response.getWriter().write(
                        "Despesa excluída com sucesso!"
                );

            } else {

                response.setStatus(
                        HttpServletResponse.SC_NOT_FOUND
                );

                response.getWriter().write(
                        "Despesa não encontrada."
                );
            }


        } catch (NumberFormatException erro) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            response.getWriter().write(
                    "ID da despesa inválido."
            );
        }
    }


    // =================================================
    // EVITA QUE TEXTO QUEBRE O JSON
    // =================================================

    private String escaparJson(String texto) {

        if (texto == null) {
            return "";
        }

        return texto
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}