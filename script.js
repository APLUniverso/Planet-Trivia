const divPregunta = document.getElementById("pregunta")
const divOpciones = document.getElementById("opciones")

function crearImagen(url){
    img = document.createElement("img")
    img.src = url
    return img
}

function obtenerAleatorio(array) {
    const indice = Math.floor(Math.random() * array.length);
    return array[indice];
}

async function obtenerPaises() {
    try {
        const response = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population"
        );

        if (!response.ok) {
            throw new Error("Error: " + response.status);
        }

        const data = await response.json();
        return data

    } catch (error) {
        console.error("Error ❌", error);
    }
}

async function inicio() {
    paisesData = await obtenerPaises()

    correcto = obtenerAleatorio(paisesData)
    incorrecto = []
    for(i=0;i>2;i++){
        incorrecto.push(obtenerAleatorio(paisesData))
    }
}