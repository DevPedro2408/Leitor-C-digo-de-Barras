let nomeProduto = document.getElementById("nomeProduto")
let codigo = document.getElementById("codigo")
let Quantidade = document.getElementById("Quantidade")
let preco = document.getElementById("preco")
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

function cadastrar() {

    let verificaoProdutos = produtos.findIndex(elements => elements.codigo_barras === Number(codigo.value)) 

    if (verificaoProdutos === -1) {
        produtos.push({
            nome_produto: nomeProduto.value,
            codigo_barras: Number(codigo.value),
            Quantidade_produtos: Number(Quantidade.value),
            preco_value: Number(preco.value)
            }
        )
    } else {
        produtos[verificaoProdutos].nome_produto = nomeProduto.value
        produtos[verificaoProdutos].codigo_barras = Number(codigo.value)
        produtos[verificaoProdutos].Quantidade_produtos = Number(Quantidade.value)
        produtos[verificaoProdutos].preco_value = Number(preco.value)
    }


    inputsProdutos.forEach(inputs => inputs.value = "")
    console.log(produtos)
    adicionarAoHTML()
}

function adicionarAoHTML() {
    adicionarProdutos.innerHTML = ""
    let cont = 1

    produtos.forEach((elementos, indice) => {
        let addProdutos = document.createElement("tr")
        addProdutos.innerHTML = `
        <td>${cont++}</td>
        <td>${elementos.nome_produto}</td>
        <td>${elementos.codigo_barras}</td>
        <td>${elementos.Quantidade_produtos}</td>
        <td>${elementos.preco_value}</td>
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
        nomeProduto.value = produtos[ind].nome_produto
        codigo.value = produtos[ind].codigo_barras
        Quantidade.value = produtos[ind].Quantidade_produtos
        preco.value = produtos[ind].preco_value
    })
}

function excluir(ele, botaoExcluir, indice) {
    botaoExcluir.addEventListener("click", () => {
        produtos.splice(indice, 1)
        adicionarAoHTML()
    })
}
