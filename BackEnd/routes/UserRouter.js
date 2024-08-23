const express = require('express');
const router = express.Router();
const UserController = require('../Controller/UserController');

router.get('/', (req, res) => {
    res.status(200).send('<h1>Página inicial da API</h1>');
})

router.post('/register', (req, res) => UserController.CreateUser(req, res));
router.post('/login', (req, res) => UserController.LoginUser(req, res));

router.get('/viewUsers', (req, res) => UserController.ViewAllUser(req, res));
router.get('/getUserById/:id', UserController.checkToken, (req, res) => UserController.GetUserById(req, res));


module.exports = router;