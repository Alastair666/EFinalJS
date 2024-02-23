//  Método que muestra la notificación
function notificaMsj(texto, tipo, segundos){
    let estilo = ""
    switch (tipo){
        case "Correcto":
            estilo = "success"
            break;
        case "Alerta":
            estilo = "warning"
            break;
        case "Error":
            estilo = "danger"
            break;
        default:
        case "Info":
            estilo = "primary"
            break;
    }
    //Mostrando notificación
    Toastify({
        text: texto,
        duration: (parseInt(segundos) || 0) * 1000,
        close: true,
        style: { background: estilo }
    }).showToast()
}

function creaElementosDinamicos(arrayMenu){
    let contenido = ``
    if (arrayMenu.length > 0) {
        //Recorrer elementos
        arrayMenu.forEach((e)=>{
            let strAtributos = ``, strElementos = ``, valor = e.contenido != null ? e.contenido : ``
            let atributos = [], elementos = []

            if (e.elementos != null){
                elementos.push(...e.elementos)
                strElementos = creaElementosDinamicos(elementos)
            }
            if (e.atributos != null){
                atributos.push(...e.atributos)
                strAtributos = creaAtributosElemento(atributos)
            }
            //Enlazando Contenido en un elemento
            contenido += `<${e.tipo}${strAtributos}>${valor + strElementos}</${e.tipo}>`
        });
    }
    return contenido
}
//  Crea atributos de un elemento HTML
function creaAtributosElemento(atributos){
    let datos = ``
    if (atributos.length > 0)
        atributos.forEach((a)=> datos += ` ${a.nombre}="${a.valor}"`)
    return datos
}
//  Obtiene Fecha Actual (LUXON)
function obteneFechaActual(){
    const fec = luxon.DateTime.now()
    // Formato: yyyy/MM/dd HH:mm
    return `${fec.year}/${fec.month}/${fec.day} ${fec.hour}:${fec.minute}`
}