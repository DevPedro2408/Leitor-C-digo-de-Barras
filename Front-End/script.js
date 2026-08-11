let nomeProduto = document.getElementById("nomeProduto")
let codigo = document.getElementById("codigo")
let Quantidade = document.getElementById("Quantidade")
let precoValue = document.getElementById("preco")
let inputsProdutos = [...document.querySelectorAll(".inputsProdutos")]
let adicionarProdutos = document.getElementById("adicionarProdutos")

let produtos = []

//Leitor de código de barras
const codeReader = new ZXing.BrowserBarcodeReader()

codeReader.decodeFromVideoDevice(null, 'camera', (result, err) => {

    if (result) {

        codigo.value = Number(result.text)

        console.log("Código detectado:", codigo)
    }
})

async function cadastrar() {
    console.log("A função cadastrar foi executada!");
    
    let verificaoProdutos = produtos.findIndex(elements => elements.codigo_barras === Number(codigo.value)) 

    if (event) {
        event.preventDefault()
    }

    if (verificaoProdutos === -1) {
        let produto = {
            nome: nomeProduto.value,
            codigo_barras: Number(codigo.value),
            estoque: Number(Quantidade.value),
            preco: Number(precoValue.value)
        }
       
        produtos.push(produto)

        await salvarProdutos(produto)

    } else {
        produtos[verificaoProdutos].nome = nomeProduto.value
        produtos[verificaoProdutos].codigo_barras = Number(codigo.value)
        produtos[verificaoProdutos].estoque = Number(Quantidade.value)
        produtos[verificaoProdutos].preco = Number(precoValue.value)
    }

    inputsProdutos.forEach(inputs => inputs.value = "")

    console.log(produtos)

    adicionarAoHTML()
}

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
        <td>${elementos.codigo_barras}</td>
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

        editar(elementos, btnEditar, indice)
        excluir(elementos, btnExcluir, indice)
    })
}

function editar(ele, botaoEditar, ind) {
    botaoEditar.addEventListener("click", () => {
        nomeProduto.value = produtos[ind].nome
        codigo.value = produtos[ind].codigo_barras
        Quantidade.value = produtos[ind].estoque
        precoValue.value = produtos[ind].preco
    })
}

function excluir(ele, botaoExcluir, indice) {
    botaoExcluir.addEventListener("click", () => {
        produtos.splice(indice, 1)
        adicionarAoHTML()
    })
}
