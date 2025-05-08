const express = require('express');
const bcrypt = require('bcrypt');
const auth = require('./jwt');
const util = require('util');
const isAuthorized = util.promisify(auth.isAuthorized);
var routes = express.Router();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

routes.get('/isAuthorized', async(req, res) => {
    try {
        const isAuthorized = await isAuthorized(req.cookies?.clientToken);
        if (!isAuthorized) return res.status(400).send("Sessão Inválida, Sem Acesso.");
        return res.status(200).send("Sessão Válida com Sucesso.");
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro: '+ error);
    }
});

routes.post('/register', async(req, res) => {    
    try {
        const username = (req.body && req.body.username ? req.body.username : null);
        const fullname = (req.body && req.body.username ? req.body.username : null);
        const password = (req.body && req.body.password ? req.body.password : null);
        if (!username||!password) { return res.status(400).send('Credenciais Inválidas.') }
        const user = await fetch(`localhost:33000/api/v1/users/getUser?username=${username}`);
        if (user) { return res.status(400).send('Credenciais Já Existentes.') }
        const cipherPassword = await bcrypt.hash(password, 12);
        const createdUser = await fetch(`localhost:33000/api/v1/users/createUser?username=${username}&fullname=${fullname}&password=${cipherPassword}`);
        if (!createdUser) { return res.status(500).send('Ocorreu um Erro.') }
        return res.status(200).send("Utilizador Criado com Sucesso!");
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro: '+ error);
    }
});

routes.post('/login', async(req, res) => {
    try {
        const username = (req.body && req.body.username ? req.body.username : null);
        const password = (req.body && req.body.password ? req.body.password : null);
        if (!username||!password) { return res.status(400).send('Credenciais Inválidas.') }
        const user = await fetch(`localhost:33000/api/v1/users/getUser?username=${username}`);
        if (!user) { res.status(400).send("Utilizador Inválido.") };
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) { return res.status(400).send('Credenciais Inválidas.') }
        const token = await auth.createToken(user.id, user.username, user.fullname);
        if (!token) { return res.status(500).send('Ocorreu um Erro.') }
        res.cookie('clientToken', token);
        return res.status(200).send("Utilizador Autenticado com Sucesso!");
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro: '+ error);
    }
});

routes.post('/logout', async(req, res) => {
    try {
        res.clearCookie('clientToken');
        return res.status(200).send('Logout Feito com Sucesso!');
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro: '+ error);
    }
});

module.exports = routes;