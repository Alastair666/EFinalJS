function recuperaHistorial() {
    return JSON.parse(localStorage.getItem("historySesion")) ?? []
}
function recuperaSesionUsuario() {
    return JSON.parse(localStorage.getItem("userSesion")) ?? {}
}
function muestraDatosUsuario() {
    let userSesion = recuperaSesionUsuario()
    //Mostrando Mensaje
    let data = `<div class="card-body">
                    <label>Username: <strong>${userSesion.username}</strong></label><br />
                    <label>Logged at: <strong>${userSesion.fechaSesion}</strong></label>                        
                </div>`
    Swal.fire({
        title: `<strong>Usuario registrado</strong>`,
        icon: "info",
        html: data,
        confirmButtonText: `<i class="fa fa-check"></i> Confirmar`
    })
}
function registraHistorial(accion, detalle) {
    let historial = recuperaHistorial()
    let registro = new HistorialSesion(obteneFechaActual(), accion, detalle)
    historial.push(registro)
    localStorage.setItem("historySesion", JSON.stringify(historial))
}


const UrlUsers = "../json/users.json"
// Validando Sesión Vigente
async function validaSesion(){
    let retorno = false
    const login = localStorage.getItem("accessToken")
    if (login != null){
        if (login != ""){
            let response = await fetch(UrlUsers)
            if (response.ok) {
                let users = await response.json()
                let id = login.split(".")
                let user = users.find((u)=> u.id === parseInt(id[0]) && encriptaCadena(u.password) === id[1])
                if (user != null)
                    retorno = true
                else
                    retorno = false
            }
        }
    }
    return retorno
}

// Simulación de encriptación de contraseña
function encriptaCadena(cadena) {
    let hash = 0;
    if (cadena.length == 0) return hash;
    for (i = 0; i < cadena.length; i++) {
        char = cadena.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

async function inicializaMain(){
    let retorno = await validaSesion()
    console.log(retorno)
    if (!retorno){
        localStorage.clear()
        location.href = "../login.html"
    }
    else {
        Toastify({
            text: 'Sesión Comprobada',
            duration: 2000,
            close: true,
            style: { background: 'darkgreen', }
        }).showToast()
    }
}

inicializaMain()