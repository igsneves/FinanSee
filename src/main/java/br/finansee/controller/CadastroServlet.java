package br.finansee.controller;

import br.finansee.dao.UsuarioDAO;
import br.finansee.model.Usuario;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/cadastro")
public class CadastroServlet extends HttpServlet {

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/plain;charset=UTF-8");

        String email = request.getParameter("email");
        String senha = request.getParameter("senha");

        if (
            email == null || email.isBlank() ||
            senha == null || senha.isBlank()
        ) {
            response.setStatus(
                HttpServletResponse.SC_BAD_REQUEST
            );

            response.getWriter().write(
                "Preencha todos os campos."
            );

            return;
        }

        Usuario usuario =
            new Usuario(email, senha);

        UsuarioDAO usuarioDAO =
            new UsuarioDAO();

        boolean cadastrado =
            usuarioDAO.cadastrar(usuario);

        if (cadastrado) {

            response.setStatus(
                HttpServletResponse.SC_CREATED
            );

            response.getWriter().write(
                "Usuário cadastrado com sucesso!"
            );

        } else {

            response.setStatus(
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );

            response.getWriter().write(
                "Não foi possível cadastrar o usuário."
            );
        }
    }
}