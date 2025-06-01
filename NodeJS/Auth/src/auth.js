require('dotenv').config();
const express = require('express');
const app = express();
var routes = express.Router();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const auth = require('./jwt');
const util = require('util');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

routes.get('/isAuthorized', async(req, res) => {
    try {
        const token = (req.headers.authorization?.split(' ')[1] || req.cookies?.clientToken);
        const isUserAuthorized = await auth.isAuthorized(token, req);
        if (!isUserAuthorized) return res.status(400).json({message: "Sessão Inválida, Sem Acesso."});
        return res.status(200).json({message: "Sessão Validada com Sucesso.", user: {id: req.user.id, username: req.user.username, type: req.user.type}});
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
    }
});

routes.post('/register', async(req, res) => {    
    try {
        const { username, fullname, password, type } = req.body;
        if (!username || !fullname || !password || !type) { return res.status(400).json({ message: "Todos os campos são obrigatórios." }); }

        const token = req.query?.token;
        const clientToken = req.cookies?.clientToken;
        if (!token || (token != process.env.ADMIN_TOKEN)) {
            const isAuthorized = await fetch('http://10.96.18.2/api/auth/isAuthorized', {credentials: 'include', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${clientToken}` }});
            if (!isAuthorized.ok) { return res.status(400).json({ message: "Sessão Inválida, Sem Acesso." });}
            const userData = await isAuthorized.json();
            if (userData.user.type != "admin") { return res.status(400).json({ message: "Acesso Negado, Sem Acesso." }); }
        }
        try {
            const response = await fetch(`http://10.96.18.2/api/users/createUser?token=${token}`, {method: 'POST', credentials: 'include', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${clientToken}` }, body: JSON.stringify({username,fullname,password,type})});
            if (!response.ok) { const errorText = await response.text(); return res.status(500).json({message: 'Ocorreu um Erro: ' + errorText}) }
            return res.status(200).json({ message: "Utilizador criado com sucesso!" });
        } catch (error) {
            return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
        }
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
    }
});

routes.post('/login', async(req, res) => {
    try {
        const {username, password} = req.body;
        try {
            const response = await fetch(`http://10.96.18.2/api/users/getUser?username=${username}`, {credentials: 'include', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${req.cookies?.clientToken}` } });
            if (!response.ok) { const errorBody = await response.text(); return res.status(500).json({ message: `Ocorreu um Erro: ${errorBody}` }); }
            const existingUsers = await response.json();
            if (Array.isArray(existingUsers) && existingUsers.length > 0) { 
                const user = existingUsers[0];
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) { return res.status(400).send('Credenciais Inválidas.') }
                const token = await auth.createToken(user.id, user.username, user.fullname, user.type);
                if (!token) { return res.status(500).send('Ocorreu um Erro.') }
                res.cookie('clientToken', token, { httpOnly: true, secure: false, sameSite: 'lax' });
                return res.status(200).json({message: "Utilizador Autenticado com Sucesso!"});
            }
            return res.status(400).json({message: 'Credenciais Inválidas.'});
        } catch (error) {
            return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
        }
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
    }
});

routes.post('/logout', async(req, res) => {
    try {
        res.clearCookie('clientToken');
        return res.status(200).send('Logout Feito com Sucesso!');
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
    }
});

module.exports = routes;