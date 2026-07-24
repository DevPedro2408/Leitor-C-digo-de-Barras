const express = require("express");
const cors = require("cors");

const app = express();

// Permite receber JSON
app.use(express.json());

// Permite o frontend acessar o backend
app.use(cors());

// Rota de teste
app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

// Inicia o servidor
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});