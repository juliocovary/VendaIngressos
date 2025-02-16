const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rotas de autenticação
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
