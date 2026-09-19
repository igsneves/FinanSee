package br.finansee;

import br.finansee.dao.UsuarioDAO;
import br.finansee.model.Usuario;

public class TesteUsuario {

    public static void main(String[] args) {

        Usuario usuario = new Usuario(
                "teste2@finansee.com",
                "123456"
        );

        UsuarioDAO usuarioDAO = new UsuarioDAO();

        boolean cadastrado =
                usuarioDAO.cadastrar(usuario);

        if (cadastrado) {
            System.out.println(
                    "Usuário cadastrado com sucesso!"
            );
        } else {
            System.out.println(
                    "Não foi possível cadastrar o usuário."
            );
        }
    }
}