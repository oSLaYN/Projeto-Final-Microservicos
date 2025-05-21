const express = require('express');
const app = express();
var routes = express.Router();
const bcrypt = require('bcrypt');
const auth = require('./jwt');
const util = require('util');
const UserAuthorized = util.promisify(auth.isAuthorized);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

routes.get('/authorized', async(req, res) => {
    try {
        const isUserAuthorized = await UserAuthorized(req.cookies?.clientToken);
        if (!isUserAuthorized) return res.status(400).send("Sessão Inválida, Sem Acesso.");
        return res.status(200).send("Sessão Válida com Sucesso.");
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro: '+ error);
    }
});

routes.post('/register', async(req, res) => {    
    try {
        const {username, fullname, password} = req.body;
        try {
            const user = await fetch(`localhost:33000/api/v1/users/getUser?username=${username}`);
            if (user) { return res.status(400).send('Credenciais Já Existentes.') }
            const cipherPassword = await bcrypt.hash(password, 12);
            const createdUser = await fetch(`localhost:33000/api/v1/users/createUser`, { method: 'POST', body: {username, fullname, cipherPassword } });
            if (!createdUser) { return res.status(500).send('Ocorreu um Erro.') }
            return res.status(200).send("Utilizador Criado com Sucesso!");
        } catch (error) {
            return res.status(500).send('Ocorreu um Erro: '+ error);
        }
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro: '+ error);
    }
});

routes.post('/login', async(req, res) => {
    try {
        const {username, password} = req.body;
        try {
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