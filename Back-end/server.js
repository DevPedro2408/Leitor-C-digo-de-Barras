const express = require("express");
const cors = require("cors");
const db = require("./database")

const app = express();

// Permite receber JSON
app.use(express.json());

// Permite o frontend acessar o backend
app.use(cors());

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            codigo_barras TEXT,
            estoque INTEGER,
            preco REAL
        )
        `)
})

// Rota de teste
app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

app.post("/produtos", (req, res) => {

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
                console.log("Erro ao salvar produto:", erro.message);

                return res.status(500).json({
                    erro: "Erro ao salvar produto"
                });
            }

            res.json({
                mensagem: "Produto cadastrado com sucesso!",
                id: this.lastID
            });
        }
    );
});

// Inicia o servidor
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});