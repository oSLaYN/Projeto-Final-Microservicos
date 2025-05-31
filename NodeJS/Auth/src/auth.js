require('dotenv').config();
const express = require('express');
const app = express();
var routes = express.Router();
const bcrypt = require('bcrypt');
const auth = require('./jwt');
const util = require('util');
const UserAuthorized = util.promisify(auth.isAuthorized);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

routes.get('/isAuthorized', async(req, res) => {
    try {
        const isUserAuthorized = await UserAuthorized(req.cookies?.clientToken);
        if (!isUserAuthorized) return res.status(400).json({message: "Sessão Inválida, Sem Acesso."});
        return res.status(200).json({message: "Sessão Validada com Sucesso."});
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ', error})
    }
});

routes.post('/register', async(req, res) => {    
    try {
        const { username, fullname, password } = req.body;
        if (!username || !fullname || !password) { return res.status(400).json({ message: "Todos os campos são obrigatórios." }); }

        const token = req.query?.token;
        if (!token || (token != process.env.ADMIN_TOKEN)) { return res.status(400).json({message: "Sem Permissão, Acesso Negado."})}
        try {
            const response = await fetch(`http://10.96.18.2/api/users/getUser?username=${encodeURIComponent(username)}`);
            if (!response.ok) { return res.status(500).json({message: 'Ocorreu um Erro: ', error}) }
            const existingUsers = await response.json();
            if (Array.isArray(existingUsers) && existingUsers.length > 0) { return res.status(400).json({ message: "Credenciais já existentes." }); }

            const cipherPassword = await bcrypt.hash(password, 12);
            const createdUserResponse = await fetch(`http://10.96.18.2/api/users/createUser?token=${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, fullname, password: cipherPassword, type: "admin" }),
            });

            if (!createdUserResponse.ok) {
                const errorMsg = await createdUserResponse.json();
                return res.status(500).json({message: 'Ocorreu um Erro: ', errorMsg})
            }
            return res.status(200).json({ message: "Utilizador criado com sucesso!" });
        } catch (error) {
            return res.status(500).json({message: 'Ocorreu um Erro: ', error})
        }
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ', error})
    }
});

routes.post('/login', async(req, res) => {
    try {
        const {username, password} = req.body;
        try {
            const response = await fetch(`http://10.96.18.2/api/users/getUser?username=${username}`);
            if (!response.ok) { return res.status(500).json({message: 'Ocorreu um Erro: ', error}) }
            const existingUsers = await response.json();
            if (Array.isArray(existingUsers) && existingUsers.length > 0) { 
                const user = existingUsers[0];
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) { return res.status(400).send('Credenciais Inválidas.') }
                const token = await auth.createToken(user.id, user.username, user.fullname);
                if (!token) { return res.status(500).send('Ocorreu um Erro.') }
                res.cookie('clientToken', token);
                return res.status(200).json({message: "Utilizador Autenticado com Sucesso!"});
            }
            return res.status(400).json({message: 'Credenciais Inválidas.'});
        } catch (error) {
            return res.status(500).json({message: 'Ocorreu um Erro: ', error})
        }
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ', error})
    }
});

routes.post('/logout', async(req, res) => {
    try {
        res.clearCookie('clientToken');
        return res.status(200).send('Logout Feito com Sucesso!');
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ', error})
    }
});

module.exports = routes;