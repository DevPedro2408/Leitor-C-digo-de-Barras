let nomeProduto = document.getElementById("nomeProduto")
let codigo = document.getElementById("codigo")
let Quantidade = document.getElementById("Quantidade")
let precoValue = document.getElementById("preco")
let inputsProdutos = [...document.querySelectorAll(".inputsProdutos")]
let adicionarProdutos = document.getElementById("adicionarProdutos")

let produtos = []

let produtoEditando = null

console.log("SCRIPT FOI CARREGADO")

//Leitor de código de barras
const codeReader = new ZXing.BrowserBarcodeReader()

codeReader.decodeFromVideoDevice(null, 'camera', (result, err) => {

    if (result) {

        codigo.value = Number(result.text)

        console.log("Código detectado:", codigo)
    }
})

async function cadastrar() {

    const produto = {

        nome: nomeProduto.value,

        codigo_barras: Number(codigo.value),

        estoque: Number(Quantidade.value),

        preco: Number(precoValue.value)

    }


    // EDITANDO
    if (produtoEditando !== null) {

        const resposta = await fetch(
            `http://localhost:3000/produtos/${produtoEditando}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(produto)
            }
        )


        const dados = await resposta.json()

        console.log(dados)


        // Atualiza o produto dentro do array
        const indice = produtos.findIndex(
            elemento => elemento.id === produtoEditando
        )


        if (indice !== -1) {

            produtos[indice] = {
                id: produtoEditando,
                ...produto
            }

        }


        produtoEditando = null

    }


    // CADASTRANDO
    else {

        const resposta = await fetch(
            "http://localhost:3000/produtos",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(produto)
            }
        )


        const dados = await resposta.json()

        console.log(dados)


        // Adiciona o produto retornado pelo banco
        produtos.push({
            id: dados.id,
            ...produto
        })

    }


    inputsProdutos.forEach(input => {
        input.value = ""
    })


    adicionarAoHTML()

}

const botaoCadastrar = document.getElementById("botaoCadastrar")

botaoCadastrar.addEventListener("click", function(event) {

    event.preventDefault()

    cadastrar()

})

async function salvarProdutos(produto) {

    try {

        const resposta = await fetch("http://localhost:3000/produtos", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(produto)
        })

        const dados = await resposta.json()

        console.log("Resposta do backend:", dados)

        if (!resposta.ok) {
            console.log("Erro ao salvar:", dados)
            return false
        }

        return true

    } catch (erro) {

        console.log("Erro ao conectar com o backend:", erro)

        return false
    }
}

function adicionarAoHTML() {
    adicionarProdutos.innerHTML = ""
    let cont = 1

    produtos.forEach((elementos, indice) => {
        let addProdutos = document.createElement("tr")
        addProdutos.innerHTML = `
        <td>${cont++}</td>
        <td>${elementos.nome}</td>
        <td>${Math.floor(elementos.codigo_barras)}</td>
        <td>${elementos.estoque}</td>
        <td>${elementos.preco}</td>
        <td></td>
        `

        let ultimoElemento = addProdutos.lastElementChild

        const btnEditar = document.createElement("button")
        btnEditar.classList.add("btnEditar")
        btnEditar.innerHTML = "Editar"

        const btnExcluir = document.createElement("button")
        btnExcluir.classList.add("btnExcluir")
        btnExcluir.innerHTML = "X"

        adicionarProdutos.appendChild(addProdutos)
        ultimoElemento.append(btnEditar, btnExcluir)

        editar(elementos, btnEditar)
        excluir(elementos, btnExcluir)
    })
}

function editar(ele, botaoEditar) {
    botaoEditar.addEventListener("click", () => {
        nomeProduto.value = ele.nome

        codigo.value = ele.codigo_barras

        Quantidade.value = ele.estoque

        precoValue.value = ele.preco

        produtoEditando = ele.id

        console.log("Editando produto:", ele.id)
        botaoCadastrar.innerHTML("Salvar Produto")
    })
}

function excluir(produto, botaoExcluir) {

    botaoExcluir.addEventListener("click", async () => {

        // const confirmar = confirm(
        //     `Deseja excluir o produto "${produto.nome}"?`
        // )

        const confirmar = true // Tirar

        if (!confirmar) {
            return
        }


        const resposta = await fetch(
            `http://localhost:3000/produtos/${produto.id}`,
            {
                method: "DELETE"
            }
        )


        const dados = await resposta.json()

        console.log(dados)


        produtos = produtos.filter(
            elemento => elemento.id !== produto.id
        )


        adicionarAoHTML()

    })

}

async function buscarProdutos() {

    const resposta = await fetch("http://localhost:3000/produtos");

    const dados = await resposta.json();

    console.log("Produtos vindos do banco:", dados);

    produtos = dados;

    adicionarAoHTML();
}

buscarProdutos();