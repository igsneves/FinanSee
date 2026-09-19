package br.finansee.dao;

import br.finansee.model.Receita;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import java.util.ArrayList;
import java.util.List;

public class ReceitaDAO {


    // =================================================
    // CADASTRAR RECEITA
    // =================================================

    public boolean cadastrar(Receita receita) {

        String sql = """
                INSERT INTO receitas
                (usuario_id, descricao, valor, data, categoria)
                VALUES (?, ?, ?, ?, ?)
                """;

        try (
            Connection conexao = Conexao.conectar();
            PreparedStatement stmt = conexao.prepareStatement(sql)
        ) {

            stmt.setInt(
                    1,
                    receita.getUsuarioId()
            );

            stmt.setString(
                    2,
                    receita.getDescricao()
            );

            stmt.setBigDecimal(
                    3,
                    receita.getValor()
            );

            stmt.setDate(
                    4,
                    java.sql.Date.valueOf(
                            receita.getData()
                    )
            );

            stmt.setString(
                    5,
                    receita.getCategoria()
            );

            int linhasAfetadas =
                    stmt.executeUpdate();

            return linhasAfetadas > 0;

        } catch (SQLException erro) {

            System.out.println(
                    "Erro ao cadastrar receita:"
            );

            erro.printStackTrace();

            return false;
        }
    }


    // =================================================
    // LISTAR RECEITAS DO USUÁRIO
    // =================================================

    public List<Receita> listarPorUsuario(int usuarioId) {

        List<Receita> receitas =
                new ArrayList<>();

        String sql = """
                SELECT
                    id,
                    usuario_id,
                    descricao,
                    valor,
                    data,
                    categoria
                FROM receitas
                WHERE usuario_id = ?
                ORDER BY data DESC, id DESC
                """;

        try (
            Connection conexao = Conexao.conectar();
            PreparedStatement stmt = conexao.prepareStatement(sql)
        ) {

            stmt.setInt(
                    1,
                    usuarioId
            );

            try (
                ResultSet resultado =
                        stmt.executeQuery()
            ) {

                while (resultado.next()) {

                    Receita receita =
                            new Receita();

                    receita.setId(
                            resultado.getInt("id")
                    );

                    receita.setUsuarioId(
                            resultado.getInt(
                                    "usuario_id"
                            )
                    );

                    receita.setDescricao(
                            resultado.getString(
                                    "descricao"
                            )
                    );

                    receita.setValor(
                            resultado.getBigDecimal(
                                    "valor"
                            )
                    );

                    receita.setData(
                            resultado
                                    .getDate("data")
                                    .toLocalDate()
                    );

                    receita.setCategoria(
                            resultado.getString(
                                    "categoria"
                            )
                    );

                    receitas.add(receita);
                }
            }

        } catch (SQLException erro) {

            System.out.println(
                    "Erro ao listar receitas:"
            );

            erro.printStackTrace();
        }

        return receitas;
    }


    // =================================================
    // EXCLUIR RECEITA
    // =================================================

    public boolean excluir(
            int id,
            int usuarioId
    ) {

        String sql = """
                DELETE FROM receitas
                WHERE id = ?
                AND usuario_id = ?
                """;

        try (
            Connection conexao = Conexao.conectar();
            PreparedStatement stmt =
                    conexao.prepareStatement(sql)
        ) {

            // ID da receita
            stmt.setInt(
                    1,
                    id
            );

            // ID do usuário logado
            stmt.setInt(
                    2,
                    usuarioId
            );

            int linhasAfetadas =
                    stmt.executeUpdate();


            // Se apagou pelo menos uma linha,
            // a exclusão funcionou.
            return linhasAfetadas > 0;

        } catch (SQLException erro) {

            System.out.println(
                    "Erro ao excluir receita:"
            );

            erro.printStackTrace();

            return false;
        }
    }
}