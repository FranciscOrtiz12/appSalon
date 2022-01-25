let paso = 1;
let pasoInicial = 1;
let pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
};

document.addEventListener('DOMContentLoaded', () => {
    iniciarApp();
});

function iniciarApp(){

    mostrarSeccion(); // Muestra y ocultas las secciones
    tabs(); // Cambia la secion cuando se presionen los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend de PHP

    idCliente();
    nombreCliente(); // Añade el nombre del cliente al objeto de cita
    seleccionarFecha(); // Añade la fecha de la cita en el objeto
    seleccionarHora(); // Añade la hora de la cita en el objeto
    mostrarResumen();
    
}

function mostrarSeccion(){

    // Ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar');
    }
    
    // Seleccionar la seccion con el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
};

function tabs(){
    const botones = document.querySelectorAll('.tabs button');
    
    botones.forEach( boton =>{
        boton.addEventListener('click', (e) =>{
            paso = parseInt( e.target.dataset.paso );
            mostrarSeccion(); 
            botonesPaginador();

            if( paso === 3 ){
                mostrarResumen();
            }
        });
    });
};

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if(paso === 3){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
    } else if(paso === 2){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {

        if( paso <= pasoInicial ) return;

        paso--;
        
        botonesPaginador();
        
    })
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {

        if( paso >= pasoFinal ) return;
        paso++;
        if(paso === 3){
            mostrarResumen();
        }
        botonesPaginador();

    });

}

async function consultarAPI(){

    try {
        const url = 'http://localhost:3000/api/servicios';
        const resultado = await fetch(url); 
        const servicios = await resultado.json();

        mostrarServicios( servicios );
    } catch ( error ) {
        console.log( error );
    }
}

function mostrarServicios( servicios ){

    // Iterando y mostrando los servicios
    servicios.forEach( servicio => {
        const { id, nombre, precio } = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function(){
            seleccionarServicio( servicio );
        };

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    });

}

function seleccionarServicio( servicio ){
    const { id } = servicio;
    const { servicios } = cita;
    //Identificar el elemento al que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Comprobar si un servicio ya fue agregado
    if( servicios.some( agregado => agregado.id === id ) ){ //Con some verificamos si ya hay algo en un arreglo
        //Eliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id ); //Devuelve un nuevo arreglo con todos los elementos que cumplan con la condicion (en este caso: todos los servicios que no sean igual al id del nuevo servicio seleccionado)
        divServicio.classList.remove('seleccionado');

    } else {
        //Agregarlo
        cita.servicios = [...servicios, servicio]; //Copiamos lo que tenemos en servicios y le agregamos el nuevo servicio
        divServicio.classList.add('seleccionado');
        
    }

}

function idCliente(){
    cita.id = document.querySelector('#id').value;
}

function nombreCliente(){
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e){
        const dia  = new Date(e.target.value).getUTCDay();
        if( [6, 0].includes(dia) ){
            inputFecha.value = "";
            mostrarAlerta('Fines de Semana no Permitidos','error','.formulario');
        }else{
            cita.fecha = e.target.value;
        }
    });
}

function seleccionarHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){
        const horaCita = e.target.value;
        const hora = horaCita.split(":");
        if( hora[0] > 20 || hora[0] < 9){
            inputHora.value = "";
            mostrarAlerta('Hora Invalida', 'error', '.formulario');
        }else{
            cita.hora = e.target.value;
        }
    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true){

    // Previene que se genenre mas de 1 alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        alertaPrevia.remove();
    };

    // Creamos la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    // Agregamos la alerta al HTML
    const formulario = document.querySelector(elemento);
    formulario.appendChild(alerta);

    //Eliminamos la alerta despues de 3 segundos
    if( desaparece ){
        setTimeout(() => {
            alerta.remove();
        }, 3000);   
    }
    
}

function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el contenido de resumen
    while( resumen.firstChild ){
        resumen.removeChild( resumen.firstChild );
    }

    if( Object.values(cita).includes('') || cita.servicios.length === 0 ){
        mostrarAlerta('Hacen falta datos o servicios','error','.contenido-resumen', false);
        return;
    }

    // Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    // Heading para Servicios en resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    // Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    })

    // Heading para Cita en resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // FORMATEAR LA FECHA EN ESPAÑOL
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
        

    const fechaUTC = new Date( Date.UTC( year, mes, dia ));

    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    //Boton para crear una cita
    const botonReservar  = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = "Reservar Cita";
    botonReservar.onclick = reservarCita;

    resumen.appendChild( nombreCliente );
    resumen.appendChild( fechaCita );
    resumen.appendChild( horaCita );

    resumen.appendChild( botonReservar );
}

async function reservarCita(){
    
    const { id, fecha, hora, servicios } = cita
    const idServicios = servicios.map( servicio => servicio.id );
    
    const datos = new FormData();

    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('id_user', id);
    datos.append('servicios', idServicios);

    //console.log([...datos]);

    //Peticion hacia la api
    try {
        const url = 'http://localhost:3000/api/citas';

        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });
        const resultado = await respuesta.json();

        if( resultado.resultado ){

            Swal.fire({
                icon: 'success',
                title: 'Cita Creada',
                text: 'Tu cita fue creada correctamente',
                button: 'OK'
            }).then( () => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
    }      
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita',
            button: 'OK'
          })
    }

}