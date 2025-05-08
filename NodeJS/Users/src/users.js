const express = require('express');
const app = express();
var routes = express.Router();
const util = require('util');
const sql = require('./pool');
const sqlQuery = util.promisify(sql).bind(sql);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

routes.get("/getUsers", async (req, res) => {
    try {
        const {err, results} = await sqlQuery("SELECT * FROM users");
        if (err) return res.status(500).send("Ocorreu um Erro: "+err.message);
        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro: '+ error);
    }
});

routes.get("/getUser", async (req, res) => {
    const username = (req.query && req.query.username ? req.query.username : null)
    if (!username || username==null) return res.status(404).send("Credenciais Inválidas.");
    try {
        const {err, results} = await sqlQuery("SELECT * FROM users WHERE username = ?", [username]);
        if (err) return res.status(500).send("Ocorreu um Erro: "+err.message);
        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro: '+ error);
    }
});

routes.get("/getUserByID", async (req, res) => {
    const id = (req.query && req.query.id ? req.query.id : null)
    if (!id || id==null) return res.status(404).send("ID de Utilizador Inválido.");
    try {
        const isAuthorized = await fetch('localhost:31000/api/v1/auth/isAuthorized');
        if (!isAuthorized) { return res.status(400).send("Sessão Inválida, Sem Acesso. ")}
        try {
            const {err, results} = await sqlQuery("SELECT * FROM users WHERE id = ?", [id]);
            if (err) return res.status(500).send("Ocorreu um Erro: "+err.message);
            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).send('Ocorreu um Erro: '+ error);
        }
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro: '+ error);
    }
});

routes.post("/createUser", async (req, res) => {
    const username = (req.query && req.query.username ? req.query.username : null);
    const fullname = (req.query && req.query.fullname ? req.query.fullname : null);
    const password = (req.query && req.query.password ? req.query.password : null);
    if (!username || username==null || !fullname || fullname == null || !password || password == null) return res.status(404).send("Credenciais Inválidas.");
    try {
        const {err, results} = await sqlQuery("INSERT INTO users (?, ?, ?) VALUES (username, fullname, password)", [username, fullname, password]);
        if (err) return res.status(500).send("Ocorreu um Erro: "+err.message);
        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro: '+ error);
    }
});

routes.delete("/deleteUser", async (req, res) => {
    const username = (req.query && req.query.username ? req.query.username : null);
    if (!username || username==null) return res.status(404).send("Credenciais Inválidas.");
    try {
        const isAuthorized = await fetch('localhost:31000/api/v1/auth/isAuthorized');
        if (!isAuthorized) { return res.status(400).send("Sessão Inválida, Sem Acesso. ")}
        try {
            const {err, results} = await sqlQuery("DELETE FROM users WHERE username = ?", [username]);
            if (err) return res.status(500).send("Ocorreu um Erro: "+err.message);
            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).send('Ocorreu um Erro: '+ error);
        }
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro: '+ error);
    }
});

module.exports = routes;