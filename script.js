const divPregunta = document.getElementById("pregunta")
const divOpciones = document.getElementById("opciones")

const timeNum = document.getElementById("timeIndicator")
const timeBar = document.getElementById("timePct")

//NOMBRE DE LOS PAISES EN ESPAÑOL
const displayNames = new Intl.DisplayNames(['es'], { type: 'region' });

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
            "https://restcountries.com/v3.1/all?fields=name,cca2,flags,capital,population"
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

var opts;
async function inicio() {
    paisesData = await obtenerPaises();
    timeStart = Date.now();

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
    divPregunta.innerText = "CUAL ES LA BANDERA DE " + displayNames.of(opts[0].data.cca2)
    opts = desordenarArray(opts)

    
    opts.forEach((opt) => {
        const url = opt.data.flags.png
        const alt = opt.data.flags.alt
        const nombre = displayNames.of(opt.data.cca2)
        divOpciones.innerHTML += `
            <div class="optCard">
                <img onclick="imagenClickeada(this)" src="${url}" alt="${alt}">
                <p class="invi">${nombre}</p>
            </div>
        `; 
    })
}

function imagenClickeada(){
    const optDivs = document.querySelectorAll(".optCard")
    optDivs.forEach((div) => {
        const img = div.querySelector("img");
        const url = img.src
        const p = div.querySelector("p")
        const dataImg = opts.find( opcion => opcion.data.flags.png == url)
        
        if (dataImg.isCorrect){
            div.style.backgroundColor = "#00bf1031"
            div.style.border = "5px solid #00bf11"
        }else{
            div.style.backgroundColor = "#ff33003d"
            div.style.border = "5px solid #ff3100"
        }
        div.style.borderRadius = "20px"

        img.style.width = "250px"
        img.style.height = "150px"
        p.classList.remove("invi")
    })
    pausa = true
}

let tiempoInicio = null;
let pausa = false;
function animar(timestamp) {
    if (!tiempoInicio) tiempoInicio = timestamp;
    if (pausa) return;
    const tiempoTranscurrido = (timestamp - tiempoInicio) / 1000;
    const tiempoRestante = Math.max(10 - tiempoTranscurrido, 0);

    // Actualizar texto
    timeNum.textContent = Math.ceil(tiempoRestante);

    // Actualizar barra
    const porcentaje = (tiempoRestante / 10) * 100;
    timeBar.style.width = porcentaje + "%";

    if(porcentaje <= 20){
        timeBar.style.backgroundColor = "#ff3100"
    }else if(porcentaje <= 40){
        timeBar.style.backgroundColor = "#ff9901"
    }else if(porcentaje <= 60){
        timeBar.style.backgroundColor = "#fece00"
    }else if(porcentaje <= 80){
        timeBar.style.backgroundColor = "#8dd100"
    }else{
        timeBar.style.backgroundColor = "#00bf11"
    }

    if (tiempoRestante > 0) {
        requestAnimationFrame(animar);
    } else {
        imagenClickeada()
    }
}

requestAnimationFrame(animar);
inicio()


