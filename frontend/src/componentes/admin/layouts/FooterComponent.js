import React from 'react';
import './../css/footer.css'; 

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h2>Todos los derechos reservados</h2>
          <p>Teléfono: 3008345320</p>
        </div>

        <div className="footer-section">
          <h2>@SENA</h2>
          <ul>
            <li><a href="/about"></a></li>
            <li><a href="/services"></a></li>
            <li><a href="/contact">Contcto</a></li>
          </ul>
        </div>

        
      </div>

      <div className="footer-bottom">
        <p>&copy; .</p>
      </div>
    </footer>
  );
}

export default Footer;
