function recuperarPrestamoSeleccionado() {
    // return JSON.parse(localStorage.getItem("miCarrito")) || []
    return JSON.parse(localStorage.getItem("prestamoSeleccionado")) ?? []
}

const contenedorCaptura = document.querySelector("div#contenedorPrestamoSeleccionado")
const contenedorAmortizacion = document.querySelector("div#contenedorAmortizacion")

function inicializaFormularioPrestamo(){
    let prestamo = recuperarPrestamoSeleccionado()
    if (prestamo != null && contenedorCaptura != null){
        configuraControlesEstaticos(prestamo)
        configuraControlesCaptura("Parcialidad", "")
    }
}
//  FUNCIÓN QUE MUESTRA LOS DETALLES DEL PRESTAMO SELECCIONADO
function configuraControlesEstaticos(prestamo){
    if (contenedorCaptura != null){
        contenedorCaptura.innerHTML = `<div class="form-floating mb-3">
                                            <input class="form-control" id="inputDescripcion${prestamo.no}" type="text" disabled="disabled" value="${prestamo.descripcion}" />
                                            <label for="inputDescripcion">Tipo de Prestamo</label>
                                        </div>
                                        <div class="form-floating mb-3">
                                            <input class="form-control" id="inputTasaInicial${prestamo.no}" type="text" disabled="disabled" value="${prestamo.tasaInicial}" />
                                            <label for="inputDescripcion">Tasa Inicial %</label>
                                        </div>
                                        <div class="form-floating mb-3">
                                            <input class="form-control" id="inputPeriodo${prestamo.no}" type="text" disabled="disabled" value="${prestamo.periodo.tipo}" />
                                            <label for="inputDescripcion">Periodo del Prestamo</label>
                                        </div>`
        const btnRestableceProceso = document.querySelector("button#btnRestableceProceso")
        if (btnRestableceProceso != null) {
            btnRestableceProceso.addEventListener("click", ()=>{
                inicializaFormularioPrestamo()
            })
        }
        const btnRegresaInicio = document.querySelector("button#btnRegresaInicio")
        if (btnRegresaInicio != null) {
            btnRegresaInicio.addEventListener("click", ()=>{
                localStorage.removeItem("prestamoSeleccionado")
                location.href = "index.html"
            })
        }
    }
}

inicializaFormularioPrestamo()

//  FUNCIÓN QUE CAPTURA LOS DETALLES DEL PRESTAMO SELECCIONADO
function configuraControlesCaptura(tipoControl, valorIngresado){
    if (contenedorCaptura != null){
        let prestamo = recuperarPrestamoSeleccionado()
        switch (tipoControl){
            case "Parcialidad":
                {
                    let banP = valorIngresado != null ? (Number.parseInt(valorIngresado) > 0 ? true : false) : false
                    //Si existe el valor, entonces se realizan las validaciones
                    if (banP){
                        let p = Number.parseInt(valorIngresado)
                        if (prestamo.periodo.permitidos.some((per)=> per == p)){
                            const inputParcialidad = document.querySelector("input#inputParcialidad")
                            if (inputParcialidad != null)
                                inputParcialidad.disabled = "disabled"
                            configuraControlesCaptura("MontoSolicitado", "")
                        }
                        else
                            notificaMsj(`La parcialidad ${valorIngresado}, no se encuentra en los permitidos: ${prestamo.periodo.permitidos.join(", ")}`, "Alerta", 4)
                    }
                    else {
                        let previo = document.querySelector("div#divParcialidad")
                        if (previo != null)
                            previo.remove()
                        
                        let parcialidad = document.createElement("div")
                        parcialidad.innerHTML = `<div id="divParcialidad" class="form-floating mb-3">
                                                    <input class="form-control" id="inputParcialidad" placeholder="Valor(es) permitido(s) [${prestamo.periodo.permitidos.join(',')}]" type="number" />
                                                    <label for="inputPeriodo">Parcialidad del Prestamo</label>
                                                </div>`
                        contenedorCaptura.append(parcialidad)
                        const inputParcialidad = document.querySelector("input#inputParcialidad")
                        if (inputParcialidad != null) {
                            inputParcialidad.focus()
                            inputParcialidad.addEventListener("change", ()=>{
                                configuraControlesCaptura("Parcialidad", inputParcialidad.value)
                            })
                        }
                    }
                    break;
                }
            case "MontoSolicitado":
                {
                    let banP = valorIngresado != null ? (Number.parseFloat(valorIngresado) > 0 ? true : false) : false
                    //Si existe el valor, entonces se realizan las validaciones
                    if (banP){
                        const inputParcialidad = document.querySelector("input#inputParcialidad")
                        let montoSolicitado = Number.parseFloat(valorIngresado)
                        if (montoSolicitado > 0){
                            const inputMontoIngresado = document.querySelector("input#inputMontoIngresado")
                            if (inputMontoIngresado != null)
                                inputMontoIngresado.disabled = "disabled"
                            let objPrestamo = new Prestamo(
                                prestamo.descripcion,
                                prestamo.tasaInicial,
                                inputParcialidad.value
                            )
                            calculaPrestamo(objPrestamo, montoSolicitado)
                            break;
                        }
                        else
                            notificaMsj("Ingrese un monto valido", "Alerta", 2)
                    }
                    else {
                        let previo = document.querySelector("div#divMontoIngresado")
                        if (previo != null)
                            previo.remove()
                        
                        let montoIngresado = document.createElement("div")
                        montoIngresado.innerHTML = `<div id="divMontoIngresado">
                                                        <div class="form-floating mb-3">
                                                            <input class="form-control" id="inputMontoIngresado" placeholder="Valor mayor a 0" type="number" />
                                                            <label for="inputMontoIngresado">Monto por Solicitar</label>
                                                        </div>
                                                        <div class="d-flex align-items-center justify-content-between mt-4 mb-0">
                                                            <button class="btn btn-success" id="btnConfirmarPrestamo" tooltip="Obtenga su tabla de amortización" type="button"><i class="fas fa-th-large"></i> Obtener tabla</button>
                                                        </div>
                                                    </div>`
                        contenedorCaptura.append(montoIngresado)
                        const inputMontoIngresado = document.querySelector("input#inputMontoIngresado")
                        if (inputMontoIngresado != null)
                            inputMontoIngresado.focus()
                    }
                    // Añadiendo evento
                    const btnConfirmarPrestamo = document.querySelector("button#btnConfirmarPrestamo")
                    btnConfirmarPrestamo.addEventListener("click", ()=>{
                        const inputMontoIngresado = document.querySelector("input#inputMontoIngresado")
                        //Registrando en Historial
                        let prestamoS = recuperarPrestamoSeleccionado()
                        registraHistorial("Visualizó el prestamo", `Confirmo detalles del ${prestamoS.descripcion} #${prestamoS.id}`)
                        let monto = inputMontoIngresado.value.trim() === "" ? 0 : parseFloat(inputMontoIngresado.value)
                        configuraControlesCaptura("MontoSolicitado", inputMontoIngresado.value)
                        if (monto <= 0)
                            notificaMsj("Ingrese un monto valido", "Alerta", 2)
                    })
                    break;
                }
        }
    }
}

function calculaPrestamo(objPrestamo, montoS){
    if (objPrestamo.id != null) {
        if (montoS != null){
            montoSolicitado = Number.parseFloat(montoS)
            if (montoSolicitado > 0){
                //Cuota del Periodo
                tablaAmortizacion = objPrestamo.obtieneValoresAmortizacion(objPrestamo.obtieneCuotaPeriodo(montoSolicitado), montoSolicitado)
                if (tablaAmortizacion != null)
                    construyeTablaAmortizacion()
                else
                    notificaMsj("No se pudo recuperar la tabla de amortización", "Alerta", 2)
            }
            else {
                notificaMsj("Debe ingresar un valor mayor a 0", "Alerta", 2)
                configuraControlesCaptura("MontoSolicitado", "")
            }
        }
        else {
            notificaMsj("Debe ingresar un valor", "Alerta", 2)
            configuraControlesCaptura("MontoSolicitado", "")
        }
    }
}

function construyeTablaAmortizacion(){
    if (tablaAmortizacion != null){
        /** Imprimiento Valores Finales **/
        const t_cuota_fija = tablaAmortizacion.reduce((a, e)=> a+e.cuota, 0)
        const t_intereses = tablaAmortizacion.reduce((a, e)=> a+e.intereses, 0)
        const t_abono_cap = tablaAmortizacion.reduce((a, e)=> a+e.abonoCapital, 0)
        contenedorAmortizacion.innerHTML = ``
        let tablaA = creaPlantillaTabla(Number.parseFloat(t_cuota_fija).toFixed(2), Number.parseFloat(t_intereses).toFixed(2), Number.parseFloat(t_abono_cap).toFixed(2))
        contenedorAmortizacion.append(tablaA)
        const tablaCuerpo = document.querySelector("table tbody")
        if (tablaCuerpo != null && tablaCuerpo != undefined){
            tablaAmortizacion.forEach((a)=>{
                tablaCuerpo.innerHTML += creaFilaTablaA(a)
            })
        }
        const btnQuitarTabla = document.querySelector("button#btnQuitaTabla")
        if (btnQuitarTabla != null) {
            btnQuitarTabla.addEventListener("click", ()=>{
                inicializaFormularioPrestamo()
                contenedorAmortizacion.innerHTML = ``
            })
        }
        const btnConfirmarPrestamo = document.querySelector("button#btnConfirmarPrestamo")
        if (btnConfirmarPrestamo != null) {
            btnConfirmarPrestamo.addEventListener("click", ()=>{
                //Registrando en Historial
                let prestamoS = recuperarPrestamoSeleccionado()
                registraHistorial("Confirmó el prestamo", `Acepto los detalles del ${prestamoS.descripcion} #${prestamoS.id}`)
                //Mostrando Mensaje
                Swal.fire({
                    title: `<strong>Prestamo Confirmado</strong>`,
                    icon: "success",
                    html: `¡En hora buena! busca otro <b>prestamo de tu interes</b> en nuestra página principal`,
                    confirmButtonText: `<i class="fa fa-long-arrow-left"></i> Regresar`,
                    timer: 4000,
                    willClose: () => {
                        location.href = "../app/index.html"
                    }
                }).then((result)=>{
                    if (result.isConfirmed || result.dismiss === Swal.DismissReason.cancel){
                        location.href = "../app/index.html"
                    }
                })
            })
        }
    }
    else
        contenedorAmortizacion.innerHTML = ``
}

function creaPlantillaTabla(t_cuota_fija, t_intereses, t_abono_cap){
    let tablaA = document.createElement("div")
    tablaA.innerHTML = `<div class="card mb-4">
                            <div class="card-header">
                                <h4>
                                    <i class="fas fa-table me-1"></i>
                                    Tabla de Amortización
                                </h4>
                            </div>
                            <div class="card-body">
                                <table class="datatable-table">
                                    <thead>
                                        <tr>
                                            <th># Periodo</th>
                                            <th>Cuota</th>
                                            <th>Intereses</th>
                                            <th>Abono Capital</th>
                                            <th>Saldo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td>T. Cuota: ${t_cuota_fija}</td>
                                            <td>T. Interes: ${t_intereses}</td>
                                            <td>T. Abono Capital: ${t_abono_cap}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div class="card-footer">
                                <div class="d-flex align-items-center justify-content-between mt-4 mb-0">
                                    <button class="btn btn-warning" id="btnQuitaTabla" tooltip="Elimina la Amortización" type="button"><i class="fas fa-close"></i> Quitar Tabla</button>
                                    <button class="btn btn-success" id="btnConfirmarPrestamo" tooltip="Confirma Prestamo" type="button"><i class="fas fa-check"></i> Confirma Prestamo</button>
                                </div>
                            </div>
                        </div>`
    return tablaA
}
function creaFilaTablaA({ periodo, cuota, intereses, abonoCapital, saldo }){
    return `<tr>
                <td>${periodo}</td>
                <td>$ ${cuota}</td>
                <td>$ ${intereses}</td>
                <td>$ ${abonoCapital}</td>
                <td>$ ${saldo}</td>
            </tr>`
}