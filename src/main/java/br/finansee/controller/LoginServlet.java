package br.finansee.controller;

import br.finansee.dao.UsuarioDAO;
import br.finansee.model.Usuario;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

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
                    "Preencha e-mail e senha."
            );

            return;
        }

        UsuarioDAO usuarioDAO = new UsuarioDAO();

        Usuario usuario =
                usuarioDAO.buscarPorEmailESenha(email, senha);

        if (usuario != null) {

            HttpSession sessao = request.getSession();

            sessao.setAttribute(
                    "usuarioId",
                    usuario.getId()
            );

            sessao.setAttribute(
                    "usuarioEmail",
                    usuario.getEmail()
            );

            response.setStatus(
                    HttpServletResponse.SC_OK
            );

            response.getWriter().write(
                    "Login realizado com sucesso!"
            );

        } else {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.getWriter().write(
                    "E-mail ou senha incorretos."
            );
        }
    }
}