// Enlazamos con elementos HTML
const contenedorPrestamos = document.querySelector("div#contenedorPrestamos")
const busqueda = document.querySelector("input[type=search]")
// Armar HTML dinámico
function retornarDivItemHTML({ no, descripcion, icono, tasaInicial, periodo }) {
    let estilo_card = "", estilo_label = ""
    estilo_card = periodo.tipo == 'mensual' ? "secondary" : "info"
    if (tasaInicial > 2.0)
        estilo_label = "danger"
    else if (tasaInicial <= 2.0 && tasaInicial >= 1.6)
        estilo_label = "warning"
    else if (tasaInicial < 1.6)
        estilo_label = periodo.tipo == 'mensual' ? "success" : "primary"
    
    return `<div id="divPrestamo${no}" class="col-xl-3 col-md-6">
                <div class="card text-white mb-4">
                    <div class="card-header bg-${estilo_card}">
                        <h4><div class="card-title">${icono} ${descripcion}</div></h4>
                    </div>
                    <div class="card-body bg-dark">
                        <label class="btn bg-${estilo_label}">${periodo.tipo.toUpperCase()}</label>
                        <label class="btn bg-${estilo_label}">Tasa: ${tasaInicial}%</label><br /><br />
                        <div class="card-subtitle">Parcialidades de ${periodo.permitidos.join(', ')}</div>                        
                    </div>
                    <div class="card-footer bg-dark d-flex align-items-center justify-content-between">
                        <button class="btn bg-info btn-details-accept" name="selecciona${no}" id="${no}" tooltip="Selecciona el prestamo" type="button"><i class="fas fa-feed"></i></button>
                        <button class="btn bg-danger btn-details-delete" name="elimina${no}" id="${no}" tooltip="Selecciona el prestamo" type="button"><i class="fas fa-minus"></i></button>
                    </div>
                </div>
            </div>`
}
function retornarDivItemError() {
    return `<div class="col-xl-3 col-md-6">
                <div class="card bg-danger text-white mb-4">
                    <div class="card-body">
                        <div class="card-title">No se han podido listar los prestamos</div>
                    </div>
                </div>
            </div>`
}
function cargarPrestamos(array) {
    if (array.length > 0) {
        contenedorPrestamos.innerHTML = ""
        array.forEach((prestamo)=> {
            contenedorPrestamos.innerHTML += retornarDivItemHTML(prestamo)
        })
        activarFuncionSeleccionaPrestamo()
    } else {
        contenedorPrestamos.innerHTML = retornarDivItemError()
    }
}
//Invoca función de Prestamos
cargarPrestamos(tiposPrestamos)

function activarFuncionSeleccionaPrestamo(){
    const botones_consultar = document.querySelectorAll("button.btn-details-accept")
    const botones_cancelar = document.querySelectorAll("button.btn-details-delete")
    if (botones_consultar != null) {
        for (let btn of botones_consultar) {
            //Añadiendo evento a cada prestamo
            btn.addEventListener("click", ()=> {
                const prestamo = tiposPrestamos.find((p)=> p.no == parseInt(btn.id))
                if (prestamo != null){
                    Swal.fire({
                        title: `<strong>Prestamo Seleccionado</strong>`,
                        icon: "success",
                        html: `Recuerde solicitar un monto ligeramente <b>más elevado</b> para que el cotizador tenga un margen amplio`,
                        showDenyButton: true,
                        confirmButtonText: `<i class="fa fa-thumbs-up"></i> Confirmar`,
                        denyButtonText: `<i class="fa fa-thumbs-down"></i> Cancelar`
                    }).then((result)=>{
                        if (result.isConfirmed){
                            localStorage.removeItem("prestamoSeleccionado")
                            localStorage.setItem("prestamoSeleccionado", JSON.stringify(prestamo))
                            location.href = "../app/prestamo.html"
                        }
                    })
                }
                else
                    notificaMsj("No se puede recuperar el prestamo seleccionado", "Error", 2)
            })
        }
    }
    if (botones_cancelar != null) {
        for (let btn of botones_cancelar) {
            //Añadiendo evento a cada prestamo
             btn.addEventListener("click", ()=> {
                Swal.fire({
                    title: `<strong>Confirmación necesaria</strong>`,
                    icon: "info",
                    html: `¿Esta seguro que desea <b>eliminar</b> el prestamo?`,
                    showDenyButton: true,
                    confirmButtonText: `<i class="fa fa-thumbs-up"></i> Confirmar`,
                    denyButtonText: `<i class="fa fa-thumbs-down"></i> Cancelar`
                }).then((result)=>{
                    if (result.isConfirmed){
                        let id_srt = "div#divPrestamo"+btn.id
                        const divPrestamo = document.querySelector(id_srt)
                        if (divPrestamo != null && divPrestamo != undefined) 
                            divPrestamo.remove()
                        else
                            notificaMsj("No se puede recuperar el prestamo seleccionado", "Error", 3)
                    }
                    else
                        notificaMsj("Debe de confirmar la operación para eliminar", "Alerta", 2)
                })
            })
        }
    }
}

//  Eventos de busqueda
busqueda.addEventListener("keypress", (e)=>{
    if (e.key === "Enter" && busqueda.value.trim() !== ""){ //
        const filtrado = tiposPrestamos.filter((prestamo)=> prestamo.descripcion.includes(busqueda.value.trim()))
        cargarPrestamos(filtrado.length > 0 ? filtrado : tiposPrestamos)
    }
})
busqueda.addEventListener("input", ()=>{
    busqueda.value.trim() === "" && cargarPrestamos(tiposPrestamos)
})