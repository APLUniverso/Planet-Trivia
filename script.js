const divPregunta = document.getElementById("pregunta")
const divOpciones = document.getElementById("opciones")

var opts;

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

    opts = [{
        data: obtenerAleatorio(paisesData),
        isCorrect : true
    }]

    for(i=0;i<3;i++){
        //validar que el pais no exista ya en el array
        opts.push({
            data: obtenerAleatorio(paisesData),
            isCorrect: false
        })
    }

    divPregunta.innerText = "CUAL ES LA BANDERA EL PAIS " + opts[0].data.name.common.toUpperCase()
    opts.forEach((opt,index) => {
        img = crearImagen(opt.data.flags.png)
        //img.id = "opt"+(index+1)
        img.onclick = function() {
            imagenClickeada(this);
        };

        divOpciones.appendChild(img)
    })

    console.log(opts)
    
}

function imagenClickeada(img){
    url = img.src
    dataImg = opts.find( opcion => opcion.data.flags.png == url)
    if(dataImg.isCorrect){
        console.log("correcto")
    }else{
        console.log("incorrecto")
    }
}

inicio()
