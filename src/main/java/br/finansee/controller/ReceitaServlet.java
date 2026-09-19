package br.finansee.controller;

import br.finansee.dao.ReceitaDAO;
import br.finansee.model.Receita;

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

@WebServlet("/receita")
public class ReceitaServlet extends HttpServlet {


    // =================================================
    // GET - LISTAR RECEITAS
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


        ReceitaDAO receitaDAO =
                new ReceitaDAO();

        List<Receita> receitas =
                receitaDAO.listarPorUsuario(
                        usuarioId
                );


        StringBuilder json =
                new StringBuilder();

        json.append("[");


        for (int i = 0; i < receitas.size(); i++) {

            Receita receita =
                    receitas.get(i);

            json.append("{");

            json.append("\"id\":")
                    .append(receita.getId())
                    .append(",");

            json.append("\"descricao\":\"")
                    .append(
                            escaparJson(
                                    receita.getDescricao()
                            )
                    )
                    .append("\",");

            json.append("\"valor\":")
                    .append(receita.getValor())
                    .append(",");

            json.append("\"data\":\"")
                    .append(receita.getData())
                    .append("\",");

            json.append("\"categoria\":\"")
                    .append(
                            escaparJson(
                                    receita.getCategoria()
                            )
                    )
                    .append("\"");

            json.append("}");


            if (i < receitas.size() - 1) {
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
    // POST - CADASTRAR RECEITA
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
                    "Preencha todos os dados da receita."
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
                        "O valor da receita deve ser maior que zero."
                );

                return;
            }


            Receita receita =
                    new Receita(
                            usuarioId,
                            descricao,
                            valor,
                            data,
                            categoria
                    );


            ReceitaDAO receitaDAO =
                    new ReceitaDAO();

            boolean cadastrado =
                    receitaDAO.cadastrar(
                            receita
                    );


            if (cadastrado) {

                response.setStatus(
                        HttpServletResponse.SC_CREATED
                );

                response.getWriter().write(
                        "Receita cadastrada com sucesso!"
                );

            } else {

                response.setStatus(
                        HttpServletResponse.SC_INTERNAL_SERVER_ERROR
                );

                response.getWriter().write(
                        "Não foi possível cadastrar a receita."
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
                    "Os dados da receita são inválidos."
            );
        }
    }


    // =================================================
    // DELETE - EXCLUIR RECEITA
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
        // PEGA O USUÁRIO LOGADO
        // =============================================

        int usuarioId =
                (Integer) sessao.getAttribute(
                        "usuarioId"
                );


        // =============================================
        // PEGA O ID DA RECEITA
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
                    "Informe o ID da receita."
            );

            return;
        }


        try {

            int id =
                    Integer.parseInt(idTexto);


            if (id <= 0) {

                response.setStatus(
                        HttpServletResponse.SC_BAD_REQUEST
                );

                response.getWriter().write(
                        "ID da receita inválido."
                );

                return;
            }


            // =========================================
            // EXCLUI NO BANCO
            // =========================================

            ReceitaDAO receitaDAO =
                    new ReceitaDAO();


            boolean excluido =
                    receitaDAO.excluir(
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
                        "Receita excluída com sucesso!"
                );

            } else {

                response.setStatus(
                        HttpServletResponse.SC_NOT_FOUND
                );

                response.getWriter().write(
                        "Receita não encontrada."
                );
            }


        } catch (NumberFormatException erro) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            response.getWriter().write(
                    "ID da receita inválido."
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