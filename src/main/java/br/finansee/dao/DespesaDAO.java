package br.finansee.dao;

import br.finansee.model.Despesa;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import java.util.ArrayList;
import java.util.List;

public class DespesaDAO {


    // =================================================
    // CADASTRAR DESPESA
    // =================================================

    public boolean cadastrar(Despesa despesa) {

        String sql = """
                INSERT INTO despesas
                (usuario_id, descricao, valor, data, categoria)
                VALUES (?, ?, ?, ?, ?)
                """;

        try (
            Connection conexao = Conexao.conectar();
            PreparedStatement stmt = conexao.prepareStatement(sql)
        ) {

            stmt.setInt(
                    1,
                    despesa.getUsuarioId()
            );

            stmt.setString(
                    2,
                    despesa.getDescricao()
            );

            stmt.setBigDecimal(
                    3,
                    despesa.getValor()
            );

            stmt.setDate(
                    4,
                    java.sql.Date.valueOf(
                            despesa.getData()
                    )
            );

            stmt.setString(
                    5,
                    despesa.getCategoria()
            );

            int linhasAfetadas =
                    stmt.executeUpdate();

            return linhasAfetadas > 0;

        } catch (SQLException erro) {

            System.out.println(
                    "Erro ao cadastrar despesa:"
            );

            erro.printStackTrace();

            return false;
        }
    }


    // =================================================
    // LISTAR DESPESAS DO USUÁRIO
    // =================================================

    public List<Despesa> listarPorUsuario(int usuarioId) {

        List<Despesa> despesas =
                new ArrayList<>();

        String sql = """
                SELECT
                    id,
                    usuario_id,
                    descricao,
                    valor,
                    data,
                    categoria
                FROM despesas
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

                    Despesa despesa =
                            new Despesa();

                    despesa.setId(
                            resultado.getInt("id")
                    );

                    despesa.setUsuarioId(
                            resultado.getInt(
                                    "usuario_id"
                            )
                    );

                    despesa.setDescricao(
                            resultado.getString(
                                    "descricao"
                            )
                    );

                    despesa.setValor(
                            resultado.getBigDecimal(
                                    "valor"
                            )
                    );

                    despesa.setData(
                            resultado
                                    .getDate("data")
                                    .toLocalDate()
                    );

                    despesa.setCategoria(
                            resultado.getString(
                                    "categoria"
                            )
                    );

                    despesas.add(despesa);
                }
            }

        } catch (SQLException erro) {

            System.out.println(
                    "Erro ao listar despesas:"
            );

            erro.printStackTrace();
        }

        return despesas;
    }


    // =================================================
    // EXCLUIR DESPESA
    // =================================================

    public boolean excluir(
            int id,
            int usuarioId
    ) {

        String sql = """
                DELETE FROM despesas
                WHERE id = ?
                AND usuario_id = ?
                """;

        try (
            Connection conexao = Conexao.conectar();
            PreparedStatement stmt =
                    conexao.prepareStatement(sql)
        ) {

            // ID da despesa
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


            return linhasAfetadas > 0;

        } catch (SQLException erro) {

            System.out.println(
                    "Erro ao excluir despesa:"
            );

            erro.printStackTrace();

            return false;
        }
    }
}