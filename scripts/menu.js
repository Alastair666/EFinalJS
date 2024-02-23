const navBar = document.querySelector("nav#menuPrincipal")
const navMenu = document.querySelector("div#layoutSidenav_nav")

const UrlNav = "../json/nav.json", UrlMenu = "../json/menu.json"
const contenidoNav = [], contenidoMenu = []

async function creaMenuPrincipal(){
    const nav = await fetch(UrlNav)
    if (nav.ok){
        const jsonNav = await nav.json()
        contenidoNav.push(...jsonNav)
        navBar.innerHTML = creaElementosDinamicos(contenidoNav)
    }
    const menu = await fetch(UrlMenu)
    if (menu.ok){
        const jsonMenu = await menu.json()
        contenidoMenu.push(...jsonMenu)
        navMenu.innerHTML = creaElementosDinamicos(contenidoMenu)
    }
    creaEventosSesion()
}

creaMenuPrincipal()

function creaEventosSesion(){
    const liUserData = document.querySelector("a#liUserData")
    if (liUserData){
        liUserData.addEventListener("click", ()=>{
            muestraDatosUsuario()
        })
    }
}