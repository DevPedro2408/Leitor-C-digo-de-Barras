const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./produtos.db", (erro) => {
    if (erro) {
        console.log("Erro ao conectar ao banco:", erro.message)
    } else {
        console.log("Banco conectado com sucesso!")
    }
})

module.exports = db