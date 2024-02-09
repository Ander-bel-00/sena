

$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $("#sidebar").mCustomScrollbar({
            theme: "minimal"
        });
        $('#sidebar, #content').toggleClass('active');
            logo.style.display = 'none';
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');

            

        // Selecciona el elemento del logo
        var logo = $('#logo');

        // Verifica si el menú está cerrado
        if ($('#sidebar').hasClass('active')) {
            // Si el menú está abierto, elimina la clase para mostrar el logo
            logo.removeClass('hidden-logo');
        } else {
            // Si el menú está cerrado, agrega la clase para ocultar el logo
            logo.addClass('hidden-logo');
        }
            
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



//script para calendario

let monthNames = ['Enero', 'Febreo', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre','Octubre', 'Noviembre', 'Diciembre'];

let currentDate = new Date();
let currentDay = currentDate.getDate();
let monthNumber = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

let dates = document.getElementById('dates');
let month = document.getElementById('month');
let year = document.getElementById('year');

let prevMonthDOM = document.getElementById('prev-month');
let nextMonthDOM = document.getElementById('next-month');

month.textContent = monthNames[monthNumber];
year.textContent = currentYear.toString();

prevMonthDOM.addEventListener('click', ()=>lastMonth());
nextMonthDOM.addEventListener('click', ()=>nextMonth());



const writeMonth = (month) => {

    for(let i = startDay(); i>0;i--){
        dates.innerHTML += ` <div class="calendar__date calendar__item calendar__last-days">
            ${getTotalDays(monthNumber-1)-(i-1)}
        </div>`;
    }

    for(let i=1; i<=getTotalDays(month); i++){
        if(i===currentDay) {
            dates.innerHTML += ` <div class="calendar__date calendar__item calendar__today">${i}</div>`;
        }else{
            dates.innerHTML += ` <div class="calendar__date calendar__item">${i}</div>`;
        }
    }
}

const getTotalDays = month => {
    if(month === -1) month = 11;

    if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
        return  31;

    } else if (month == 3 || month == 5 || month == 8 || month == 10) {
        return 30;

    } else {

        return isLeap() ? 29:28;
    }
}

const isLeap = () => {
    return ((currentYear % 100 !==0) && (currentYear % 4 === 0) || (currentYear % 400 === 0));
}

const startDay = () => {
    let start = new Date(currentYear, monthNumber, 1);
    return ((start.getDay()-1) === -1) ? 6 : start.getDay()-1;
}

const lastMonth = () => {
    if(monthNumber !== 0){
        monthNumber--;
    }else{
        monthNumber = 11;
        currentYear--;
    }

    setNewDate();
}

const nextMonth = () => {
    if(monthNumber !== 11){
        monthNumber++;
    }else{
        monthNumber = 0;
        currentYear++;
    }

    setNewDate();
}

const setNewDate = () => {
    currentDate.setFullYear(currentYear,monthNumber,currentDay);
    month.textContent = monthNames[monthNumber];
    year.textContent = currentYear.toString();
    dates.textContent = '';
    writeMonth(monthNumber);
}

writeMonth(monthNumber);




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