package br.finansee.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexao {

    private static final String URL =
            "jdbc:mysql://localhost:3306/finansee";

    private static final String USUARIO = "root";

    private static final String SENHA =
            "$Igor210306";

    public static Connection conectar() throws SQLException {

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException erro) {
            throw new SQLException(
                    "Driver do MySQL não encontrado.",
                    erro
            );
        }

        return DriverManager.getConnection(
                URL,
                USUARIO,
                SENHA
        );
    }
}