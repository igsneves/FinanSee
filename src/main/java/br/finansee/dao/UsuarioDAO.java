package br.finansee.dao;

import br.finansee.model.Usuario;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class UsuarioDAO {

    public boolean cadastrar(Usuario usuario) {

        String sql = """
                INSERT INTO usuarios (email, senha)
                VALUES (?, ?)
                """;

        try (
            Connection conexao = Conexao.conectar();
            PreparedStatement stmt = conexao.prepareStatement(sql)
        ) {

            stmt.setString(1, usuario.getEmail());
            stmt.setString(2, usuario.getSenha());

            int linhasAfetadas = stmt.executeUpdate();

            return linhasAfetadas > 0;

        } catch (SQLException erro) {

            System.out.println("Erro ao cadastrar usuário:");
            erro.printStackTrace();

            return false;
        }
    }
    public Usuario buscarPorEmailESenha(String email, String senha) {

    String sql = """
            SELECT id, email, senha
            FROM usuarios
            WHERE email = ? AND senha = ?
            """;

    try (
        Connection conexao = Conexao.conectar();
        PreparedStatement stmt = conexao.prepareStatement(sql)
    ) {

        stmt.setString(1, email);
        stmt.setString(2, senha);

        var resultado = stmt.executeQuery();

        if (resultado.next()) {

            return new Usuario(
                    resultado.getInt("id"),
                    resultado.getString("email"),
                    resultado.getString("senha")
            );
        }

    } catch (SQLException erro) {

        System.out.println("Erro ao realizar login:");
        erro.printStackTrace();
    }

    return null;
}
}