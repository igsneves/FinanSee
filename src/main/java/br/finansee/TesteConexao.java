package br.finansee;

import br.finansee.dao.Conexao;
import java.sql.Connection;

public class TesteConexao {

    public static void main(String[] args) {

        try {

            Connection conexao = Conexao.conectar();

            System.out.println(
                    "Conexão com o FinanSee realizada com sucesso!"
            );

            conexao.close();

        } catch (Exception erro) {

            System.out.println(
                    "Erro ao conectar com o banco:"
            );

            erro.printStackTrace();
        }
    }
}