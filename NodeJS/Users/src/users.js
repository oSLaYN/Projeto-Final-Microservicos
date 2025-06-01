const express = require('express');
const app = express();
var routes = express.Router();
const cookieParser = require('cookie-parser');
const util = require('util');
const bcrypt = require('bcrypt');
const sql = require('./pool');
const sqlQuery = util.promisify(sql.query).bind(sql);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

routes.get("/getUsers", async (req, res) => {
    try {
        const isAuthorized = await fetch('http://10.96.18.2/api/auth/isAuthorized', {credentials: 'include', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${req.cookies?.clientToken}` }});
        if (!isAuthorized.ok) { return res.status(400).json({ message: "Sessão Inválida, Sem Acesso." });}
        const results = await sqlQuery("SELECT * FROM users");
        return res.status(200).json(results || []);
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
    }
});

routes.get("/getUser", async (req, res) => {
    const username = req.query?.username;
    if (!username) { return res.status(400).json({ message: "Username inválido." }); }
    try {
        const results = await sqlQuery("SELECT * FROM users WHERE username = ?", [username]);
        return res.status(200).json(results || []);
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
    }
});

routes.get("/getUserByID", async (req, res) => {
    const id = req.query?.id;
    if (!id) return res.status(400).json({ message: "ID de utilizador inválido." });
    try {
        const token = (req.headers.authorization || `Bearer ${req.cookies?.clientToken}`);
        const isAuthorized = await fetch('http://10.96.18.2/api/auth/isAuthorized', {credentials: 'include', headers: {'Content-Type': 'application/json', 'Authorization': token }});
        if (!isAuthorized.ok) { return res.status(400).json({ message: "Sessão Inválida, Sem Acesso." });}
        const results = await sqlQuery("SELECT * FROM users WHERE id = ?", [id]);
        return res.status(200).json(results || []);
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
    }
});

routes.post("/createUser", async (req, res) => {
    try {
        const { username, fullname, password, type } = req.body;
        if (!username || !fullname || !password || !type) { return res.status(400).json({ message: "Dados em falta." }); }
        const token = req.query?.token;
        if (!token) {
            const isAuthorized = await fetch('http://10.96.18.2/api/auth/isAuthorized', {credentials: 'include', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${req.cookies?.clientToken}` }});
            if (!isAuthorized.ok) { return res.status(400).json({ message: "Sessão Inválida, Sem Acesso." });}
            const userData = await isAuthorized.json();
            if (userData.user.type != "admin") { return res.status(400).json({ message: "Acesso Negado, Sem Acesso." }); }
        }
        try {
            const response = await fetch(`http://10.96.18.2/api/users/getUser?username=${username}`, {credentials: 'include', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${req.cookies?.clientToken}` }});
            if (!response.ok) { return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message}) }
            const existingUsers = await response.json();
            if (Array.isArray(existingUsers) && existingUsers.length > 0) { return res.status(400).json({ message: "Credenciais já existentes." }); }
            const cipherPassword = await bcrypt.hash(password, 12);
            try {
                const results = await sqlQuery("INSERT INTO users (username, fullname, password, type) VALUES (?, ?, ?, ?)", [username, fullname, cipherPassword, type]);
                return res.status(200).json({ message: "Utilizador criado com sucesso!" });
            } catch (error) {
                return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
            }
        } catch (error) {
            return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
        }
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
    }
});

routes.post("/updateUser", async (req, res) => {
    try {
        const { id, username, fullname, type } = req.body;
        if (!id || !username || !fullname || !type) { return res.status(400).json({ message: "Dados em falta." }); }
        try {
            const isAuthorized = await fetch('http://10.96.18.2/api/auth/isAuthorized', {credentials: 'include', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${req.cookies?.clientToken}` }});
            if (!isAuthorized.ok) { return res.status(400).json({ message: "Sessão Inválida, Sem Acesso." });}
            const userData = await isAuthorized.json();
            if (userData.user.type != "admin") { return res.status(400).json({ message: "Acesso Negado, Sem Acesso." }); }
            try {            
                const results = await sqlQuery("UPDATE users SET username=?, fullname=?, type=? WHERE id=?", [username, fullname, type, id]);
                return res.status(200).json({ message: "Utilizador criado com sucesso!" });
            } catch (error) {
                return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
            }
        } catch (error) {
            return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
        }
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
    }
})

routes.delete("/deleteUser", async (req, res) => {
    const id = req.query?.id;
    if (!id) return res.status(400).json({ message: "ID de Utilizado Inválido." });
    try {
        const isAuthorized = await fetch('http://10.96.18.2/api/auth/isAuthorized', {credentials: 'include', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${req.cookies?.clientToken}` }});
        if (!isAuthorized.ok) { return res.status(400).json({ message: "Sessão Inválida, Sem Acesso." });}
        const userData = await isAuthorized.json();
        if (userData.user.type != "admin") { return res.status(400).json({ message: "Acesso Negado, Sem Acesso." }); }
        try {            
            const results = await sqlQuery("DELETE FROM users WHERE id = ?", [id]);
        return res.status(200).json({ message: "Utilizador removido com sucesso." });
        } catch (error) {
            return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
        }
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message})
    }
});

module.exports = routes;