const contenedorHistorial = document.querySelector("div#contenedorHistorial")

function inicializaFormularioHistorial(){
    let historico = recuperaHistorial()
    let tablaA = creaPlantillaTabla(historico.length)
    contenedorHistorial.append(tablaA)
    const tablaCuerpo = document.querySelector("table tbody")
        if (tablaCuerpo != null && tablaCuerpo != undefined){
            let contador = 1
            historico.forEach((reg)=>{
                tablaCuerpo.innerHTML += creaFilaTablaA(contador, reg.fecha, reg.accion, reg.detalles)
                contador++
            })
        }
}

inicializaFormularioHistorial()

function creaPlantillaTabla(t_registros){
    let tablaA = document.createElement("div")
    tablaA.innerHTML = `<div class="card mb-4">
                            <div class="card-header">
                                <h4>
                                    <i class="fas fa-user me-1"></i>
                                    Acciones del Usuario
                                </h4>
                            </div>
                            <div class="card-body">
                                <table class="datatable-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Fecha</th>
                                            <th>Accion</th>
                                            <th>Detalles</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td><b>${parseInt(t_registros) == 1 ? `1 registro` : t_registros+` registro(s)` }</b></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>`
    return tablaA
}
function creaFilaTablaA(no, fecha, accion, detalles){
    return `<tr>
                <td>${no}</td>
                <td>${fecha}</td>
                <td>${accion}</td>
                <td>${detalles}</td>
            </tr>`
}