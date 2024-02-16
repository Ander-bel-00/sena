/* Función que pasa como parametro showNav que controlará el movimiento del contenido al abrir o cerrar
el menú.*/
const handleContentMovement = (showNav) => {

    // Selecciona el elemento con la clase content.
    const content = document.querySelector('.content');

    // Si showNav es true moverá el contenido 240px a la derecha.
    if (showNav) {
      content.style.marginLeft = '240px'; 
    } else {
      
      // Si showNav es false el contenido estará en su posición inicial.  
      content.style.marginLeft = '0';
    }
  };
  
  // Exportar la función handleContentMovement.
  export default handleContentMovement;
  