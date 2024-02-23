const formLogin = document.querySelector("form#contenedorLogin")
const UrlUsers = "json/users.json"
const usuarios = []

//  Función inicial de Configuración
async function inicializaPagina(){
    localStorage.clear()
    await creaControles()
}

async function creaControles(){
    if (formLogin != null){
        formLogin.innerHTML = `<div class="form-floating mb-3">
                                            <input class="form-control" id="inputEmail" type="email" placeholder="name@example.com" />
                                            <label for="inputEmail">Email address</label>
                                        </div>
                                        <div class="form-floating mb-3">
                                            <input class="form-control" id="inputPassword" type="password" placeholder="Password" />
                                            <label for="inputPassword">Password</label>
                                        </div>
                                        <div class="d-flex align-items-center justify-content-between mt-4 mb-0">
                                            <button class="btn btn-success" id="btnInicioSesion" type="button">Login</button>
                                        </div>`
        const btnInicioSesion = document.querySelector("button#btnInicioSesion")
        if (btnInicioSesion != null) {
            btnInicioSesion.addEventListener("click", ()=>{
                const email = document.querySelector("input#inputEmail")
                const pass = document.querySelector("input#inputPassword")
                crearSesion(email.value, pass.value)
            })
        }
    }
}

inicializaPagina()

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
//  Creación sesión unica del usuario
async function crearSesion(email, password){
    let retorno = false, user
    const users = await fetch(UrlUsers)
    if (users.ok){
        const datos = await users.json()
        usuarios.push(...datos)
        user = usuarios.find((u)=> u.email === email && u.password === password)
        if (user != null)
            retorno = true
    }
    if (retorno){
        let registro = new HistorialSesion(obteneFechaActual(), "Acceso al sistema", `El usuario ${user.first_name} ${user.last_name} inicio sesión`)
        let historial = []
        historial.push(registro)
        let usuario_sesion = { username : user.last_name +' '+ user.first_name, fechaSesion : obteneFechaActual() }
        localStorage.setItem("historySesion", JSON.stringify(historial))
        localStorage.setItem("userSesion", JSON.stringify(usuario_sesion))
        localStorage.setItem("accessToken", user.id+"."+encriptaCadena(user.password))
        location.href = "app/index.html"
    }
    else{
        localStorage.clear()
        Toastify({
            text : "No se puede recuperar el usuario y contraseña",
            duration : 3000,
            close: true,
            style : { background : 'darkred' },
            onClick : function(){
                //
            }
        }).showToast()
    }
}