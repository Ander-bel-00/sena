/*Función de jQuery que se ejecuta cuando se carga totalmente el index.HTML*/
$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $("#sidebar").mCustomScrollbar({
            theme: "minimal"
        });
        $('#sidebar, #content').toggleClass('active');
            
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
   });
});


// Obtener referencias a los elementos HTML
const cerrarSesionButton = document.getElementById('cerrarSesionButton'); // Botón "Cerrar sesión"
const confirmacionCierreSesion = document.getElementById('confirmacionCierreSesion'); // Ventana de confirmación
const confirmarCierreSesion = document.getElementById('confirmarCierreSesion'); // Botón "Sí, cerrar sesión"
const cancelarCierreSesion = document.getElementById('cancelarCierreSesion'); // Botón "Cancelar"

// Analizar cuando se le de click
cerrarSesionButton.addEventListener('click', () => {
    // Mostrar la ventana de confirmación al hacer clic en Cerrar sesión
    confirmacionCierreSesion.style.display = 'block';
});

// Escucha cuando se le da click a "Sí, cerrar sesión"
confirmarCierreSesion.addEventListener('click', () => {
    
    // Registrar un mensaje en la consola para demostración
    console.log('Sesión cerrada');

    // Ocultar la ventana de confirmación después de confirmar
    confirmacionCierreSesion.style.display = 'none';
});

// Escuchar el evento de clic en el botón "Cancelar"
cancelarCierreSesion.addEventListener('click', () => {
    // Ocultar la ventana de confirmación al hacer clic en Cancelar
    confirmacionCierreSesion.style.display = 'none';
});

//Notificaciones
let notificaciones = document.getElementById('notificaciones');
//Button of bell
let campana = document.getElementById('campana');

let mostrando = false;

notificaciones.style.display = "none";

campana.addEventListener('click', () => {
    if(mostrando){
        notificaciones.style.display = "none";
    }
    else{
        notificaciones.style.display = "block";
    }
    //Cambiar los estados de mostrar o ocultar información
    mostrando = !mostrando;
});

