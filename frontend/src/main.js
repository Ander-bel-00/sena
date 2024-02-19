const handleContentMovement = (showNav) => {
  const content = document.querySelector('.content');

  if (content) {
      if (showNav) {
          content.style.marginLeft = '240px'; 
      } else {
          content.style.marginLeft = '0';
      }
  }
};

export default handleContentMovement;