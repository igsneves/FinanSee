package br.finansee.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Receita {

    private int id;
    private int usuarioId;
    private String descricao;
    private BigDecimal valor;
    private LocalDate data;
    private String categoria;

    public Receita() {
    }

    public Receita(
            int usuarioId,
            String descricao,
            BigDecimal valor,
            LocalDate data,
            String categoria
    ) {
        this.usuarioId = usuarioId;
        this.descricao = descricao;
        this.valor = valor;
        this.data = data;
        this.categoria = categoria;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(int usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
}