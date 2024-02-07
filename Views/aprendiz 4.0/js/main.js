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

   //Obtener el botón de descarga por su ID
    var descargarBitacorasBtn = document.getElementById('descargarBitacorasBtn');

    //Agrega un evento de clic al botón
    descargarBitacorasBtn.addEventListener('click', function() {
        //Ruta de tu archivo de bitácoras
        var rutaArchivo = '../aprendiz 4.0/public/formatos/Bitacoras.xlsx';

        //Crea un elemento de anclaje (link) invisible
        var link = document.createElement('a');
        link.href = rutaArchivo;

        //Asigna el atributo download para descargar el archivo con un nombre específico
        link.download = 'bitacoras.xlsx';

        //Simula un clic en el enlace para descargar el archivo
        document.body.appendChild(link);
        link.click();

        //Elimina el enlace del documento después de la descarga
        document.body.removeChild(link);
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
    })
});
