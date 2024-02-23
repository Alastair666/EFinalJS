//  Variable de Datos Finales
let tablaAmortizacion
//  Tipos de Periodos Permitidos
const tiposPeriodo = [
    //  Mensual
    { tipo : "mensual", permitidos : [ 12, 24, 36, 48, 60 ]},
    //  Anual
    { tipo : "anual", permitidos : [ 10, 15, 20, 25, 30 ]}
]
//  Tipos de Prestamos
const tiposPrestamos = [
    {
        no : 1,
        descripcion : "Préstamos personales",
        icono : '💻',
        tasaInicial : 1.5,
        periodo : tiposPeriodo.find((t)=>t.tipo === "mensual")
    },
    {
        no : 2,
        descripcion : "Préstamos al consumo",
        icono : '💻',
        tasaInicial : 1.7,
        periodo : tiposPeriodo.find((t)=>t.tipo === "mensual")
    },
    {
        no : 3,
        descripcion : "Préstamos de estudios",
        icono : '💻',
        tasaInicial : 1.2,
        periodo : tiposPeriodo.find((t)=>t.tipo === "anual")
    },
    {
        no : 4,
        descripcion : "Préstamos hipotecarios",
        icono : '💻',
        tasaInicial : 2.1,
        periodo : tiposPeriodo.find((t)=>t.tipo === "anual")
    },
    {
        no : 5,
        descripcion : "Prestamos para empresas",
        icono : '💻',
        tasaInicial : 2.2,
        periodo : tiposPeriodo.find((t)=>t.tipo === "anual")
    }
]