const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Obtener el token de la cabecera de autorización
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        // Si no hay token en la cabecera de autorización, devolver un error de autenticación
        return res.status(401).json({ message: 'No se proporcionó un token de autorización' });
    }

    // Separar el token del prefijo "Bearer"
    const token = authHeader.split(' ')[1];

    try {
        // Verificar y decodificar el token
        const decodedToken = jwt.verify(token, 'SECRETKEY');

        // Obtener el token generado en el inicio de sesión
        const generatedToken = req.cookies.token;

        // Comparar el token enviado con el token generado
        if (token === generatedToken) {
            // Si los tokens coinciden, agregar el usuario al objeto de solicitud para su uso posterior
            req.usuario = decodedToken;
            // Continuar con el siguiente middleware
            next();
        } else {
            // Si los tokens no coinciden, devolver un error de autenticación
            return res.status(401).json({ message: 'Token inválido' });
        }
    } catch (error) {
        // Si hay algún error en la verificación del token, devolver un error de autenticación
        return res.status(401).json({ message: 'Token inválido' });
    }
};
