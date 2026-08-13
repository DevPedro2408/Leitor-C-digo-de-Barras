const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static("../frontend"));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "../frontend" });
});

app.post("/produtos", (req, res) => {

    console.log("Produto recebido:", req.body);

    const { nome, codigo_barras, estoque, preco } = req.body;

    const sql = `
        INSERT INTO produtos
        (nome, codigo_barras, estoque, preco)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [nome, codigo_barras, estoque, preco],
        function (erro) {

            if (erro) {

                console.log("Erro ao salvar:", erro.message);

                return res.status(500).json({
                    erro: erro.message
                });
            }

            console.log("Produto salvo! ID:", this.lastID);

            res.json({
                mensagem: "Produto cadastrado com sucesso!",
                id: this.lastID
            });
        }
    );
});

app.get("/produtos", (req, res) => {

    const sql = "SELECT * FROM produtos";

    db.all(sql, [], (erro, produtos) => {

        if (erro) {

            console.log("Erro ao buscar produtos:", erro.message);

            return res.status(500).json({
                erro: erro.message
            });
        }

        res.json(produtos);
    });
});

app.put("/produtos/:id", (req, res) => {

    const id = req.params.id;

    const { nome, codigo_barras, estoque, preco } = req.body;

    const sql = `
        UPDATE produtos
        SET nome = ?,
            codigo_barras = ?,
            estoque = ?,
            preco = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [nome, codigo_barras, estoque, preco, id],
        function (erro) {

            if (erro) {

                console.log("Erro ao editar produto:", erro.message);

                return res.status(500).json({
                    erro: erro.message
                });
            }

            res.json({
                mensagem: "Produto atualizado com sucesso!"
            });
        }
    );
});

app.delete("/produtos/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM produtos WHERE id = ?";

    db.run(sql, [id], function (erro) {

        if (erro) {

            console.log("Erro ao excluir produto:", erro.message);

            return res.status(500).json({
                erro: erro.message
            });
        }

        res.json({
            mensagem: "Produto excluído com sucesso!"
        });
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});