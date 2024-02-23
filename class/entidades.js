class Prestamo {
    //  Constructor por defecto
    constructor(descripcion, tasaInteres, periodos) {
        this.id = ()=> parseInt(Math.random().toPrecision(4) * 10_000)
        this.descripcion = descripcion
        this.periodos = periodos
        this.tasaInteres = tasaInteres
    }
    //  Funciones
    obtieneCuotaPeriodo(montoTotalPrestamo) {
        //  Utilizando la formula de matematicas financieras
        //  C = P * [ (((1+i)^n) * 1) / (((1+i)^n) - 1) ]
        //  P : montoTotalPrestamo
        //  i : interesPeriodo %
        //  n : periodos
        let cuota_calculada = montoTotalPrestamo * ((Math.pow(1+(this.tasaInteres/100), this.periodos) * (this.tasaInteres/100)) / (Math.pow(1+(this.tasaInteres/100), this.periodos) - 1))
        //console.log("C = P * [ (((1+i)^n) * 1) / (((1+i)^n) - 1) ]\nC : " + cuota_calculada.toFixed(2)+"\nP : " + montoTotalPrestamo.toFixed(2)+"\ni : " + this.tasaInteres.toFixed(2)+"\nn : " + this.periodos.toFixed(2))
        return Number.parseFloat(cuota_calculada.toFixed(2))
    }
    obtieneValoresAmortizacion(cuota, montoTotalPrestamo) {
        let tablaAmortizacion = []
        //  Agregar el periodo 0
        tablaAmortizacion.push(new Amortizacion(0, 0, 0, 0, montoTotalPrestamo))
        //  Creamos Ciclo de Amortización en base a los periodos
        for (let p = 1; p <= this.periodos; p++) {
            //  Obtiene último periodo registrado
            let idx = tablaAmortizacion.findIndex((t)=> t.periodo === (p-1))
            let saldo_anterior = tablaAmortizacion[idx].saldo
            let interesPeriodo = saldo_anterior * (this.tasaInteres / 100)
            let abonoCapital = cuota - interesPeriodo
            let saldoPeriodo = saldo_anterior - abonoCapital
            //  Añadiendo Saldos del Periodo a la tabla de amortización
            const amortizacion = new Amortizacion(
                p, 
                cuota, 
                Number.parseFloat(interesPeriodo.toFixed(2)), 
                Number.parseFloat(abonoCapital.toFixed(2)), 
                Number.parseFloat(saldoPeriodo.toFixed(2)))
            //console.log(amortizacion)
            tablaAmortizacion.push(amortizacion)
        }
        //  Devolviendo Resultado Obtenido, eliminamos el primer elemento de Calculo
        return tablaAmortizacion
    }
    
}

class Amortizacion {
    //  Constructor dadas 
    constructor(periodo, cuota, intereses, abonoCapital, saldo){
        this.periodo = periodo
        this.cuota = cuota
        this.intereses = intereses
        this.abonoCapital = abonoCapital
        this.saldo = saldo
    }
}

class HistorialSesion {
    constructor(fecha, accion, detalles){
        this.fecha = fecha,
        this.accion = accion,
        this.detalles = detalles
    }
}