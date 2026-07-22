//Leitor de código de barras
const codeReader = new ZXing.BrowserBarcodeReader()

codeReader.decodeFromVideoDevice(null, 'camera', (result, err) => {

    if (result) {

        let codigo = result.text

        document.getElementById("codigo").value = codigo

        console.log("Código detectado:", codigo)
    }
})

