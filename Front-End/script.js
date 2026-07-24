//Leitor de código de barras
const codeReader = new ZXing.BrowserBarcodeReader()

codeReader.decodeFromVideoDevice(null, 'camera', (result, err) => {

    if (result) {

        let codigo = result.text

        document.getElementById("codigo").value = codigo

        console.log("Código detectado:", codigo)
    }
})

let nomeProduto = document.getElementById("nomeProduto")
let codigo = document.getElementById("codigo")
let Quantidade = document.getElementById("Quantidade")
let preco = document.getElementById("preco")

let produtos = []

function salvar() {
    
}
