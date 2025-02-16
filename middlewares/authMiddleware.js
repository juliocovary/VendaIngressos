const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Verifica o token no cookie ou no header
    const token = req.cookies.token || req.header('Authorization');

    if (!token) return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};