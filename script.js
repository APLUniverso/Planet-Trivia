const divPregunta = document.getElementById("pregunta")
const divOpciones = document.getElementById("opciones")

const timeNum = document.getElementById("timeIndicator")
const timeBar = document.getElementById("timePct")

var opts;
var timeStart;

function crearImagen(url){
    img = document.createElement("img")
    img.src = url
    return img
}

function obtenerAleatorio(array) {
    const indice = Math.floor(Math.random() * array.length);
    return array[indice];
}

function desordenarArray(array) {
    const copia = [...array];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
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
    paisesData = await obtenerPaises();
    timeStart = Date.now();
    console.log(timeStart)

    opts = [{
        data: obtenerAleatorio(paisesData),
        isCorrect : true
    }]

    for(i = 0; i < 3; i++){
        let optWrong = {
            data: obtenerAleatorio(paisesData),
            isCorrect: false
        }
        if (!opts.includes(optWrong)){
            opts.push(optWrong);
        }else{
            i--;
        } 
    }

    opts = desordenarArray(opts)

    divPregunta.innerText = "CUAL ES LA BANDERA DEL PAIS " + opts[0].data.name.common.toUpperCase()
    opts.forEach((opt) => {
        img = crearImagen(opt.data.flags.png)
        img.onclick = function() {
            imagenClickeada(this);
        };
        divOpciones.appendChild(img)
    })
}

function imagenClickeada(img){
    url = img.src
    dataImg = opts.find( opcion => opcion.data.flags.png == url)
    if(dataImg.isCorrect){
        console.log("correcto")
    }else{
        console.log("incorrecto")
    }
    timeBar.style.animationPlayState = "paused";
}

inicio()

//ENTENDER A LA PREFECCION COMO FUNCIONA ESTO PARA MEJORRLO
let tiempoInicio = null;
function animar(timestamp) {
    if (!tiempoInicio) tiempoInicio = timestamp;

    const tiempoTranscurrido = (timestamp - tiempoInicio) / 1000;
    const tiempoRestante = Math.max(10 - tiempoTranscurrido, 0);

    // Actualizar texto
    timeNum.textContent = Math.ceil(tiempoRestante);

    // Actualizar barra
    const porcentaje = (tiempoRestante / 10) * 100;
    timeBar.style.width = porcentaje + "%";

    if (tiempoRestante > 0) {
        requestAnimationFrame(animar);
    } else {
        console.log("Tiempo terminado");
    }
}

requestAnimationFrame(animar);
