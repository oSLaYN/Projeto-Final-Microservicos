const express = require('express');
const app = express();
var routes = express.Router();
const cookieParser = require('cookie-parser');
const util = require('util');
const sql = require('./pool');
const sqlQuery = util.promisify(sql.query).bind(sql);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

routes.get("/getTasks", async (req, res) => {
    try {
        const userid = (req.query && req.query.userid ? req.query.userid : null)
        if (!userid || userid==null) return res.status(404).send("ID de Utilizador Inválido.");
        try {
            const isAuthorized = await fetch('http://10.96.18.2/api/auth/isAuthorized', {credentials: 'include', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${req.cookies?.clientToken}` }});
            if (!isAuthorized.ok) { return res.status(400).json({ message: "Sessão Inválida, Sem Acesso." });}
            try {
                const results = await sqlQuery("SELECT * FROM tasks WHERE userid = ?", [userid]);
                return res.status(200).json(results);
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

routes.post("/createTask", async (req, res) => {
    try {
        const {userid, title, description} = req.body;
        try {
            const token = req.cookies?.clientToken;
            const isAuthorized = await fetch('http://10.96.18.2/api/auth/isAuthorized', {credentials: 'include', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }});
            if (!isAuthorized.ok) { return res.status(400).json({ message: "Sessão Inválida, Sem Acesso." });}
            try {
                const response = await fetch(`http://10.96.18.2/api/users/getUserByID?id=${userid}`, {credentials: 'include', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }});
                const existingUsers = await response.json();
                if (Array.isArray(existingUsers) && existingUsers.length > 0) {
                    try {
                        const results = await sqlQuery("INSERT INTO tasks (userid, title, description, done) VALUES (?,?,?,?)", [userid, title, description, 0]);
                        return res.status(200).json(results);
                    } catch (error) {
                        return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message});
                    }
                }
                return res.status(404).json({message: "Utilizador Inválido."});
            } catch (error) {
                return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message});
            }
        } catch (error) {
            return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message});
        }
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message});
    }
});

routes.post("/updateTask", async (req, res) => {
    try { 
        const {taskid, tasktitle, taskinfo, taskstatus} = req.body;
        try {
            const isAuthorized = await fetch('http://10.96.18.2/api/auth/isAuthorized', {credentials: 'include', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${req.cookies?.clientToken}` }});
            if (!isAuthorized.ok) { return res.status(400).json({ message: "Sessão Inválida, Sem Acesso." });}
            try {
                const results = await sqlQuery("UPDATE tasks SET title=?, description=?, done=? WHERE id=?", [tasktitle, taskinfo, taskstatus, taskid]);
                return res.status(200).json(results);
            } catch (error) {
                return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message});
            }
        } catch (error) {
            return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message});
        }
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message});
    }
});

routes.delete("/deleteTask", async (req, res) => {
    try {
        const taskid = (req.query && req.query.taskid ? req.query.taskid : null)
        if (!taskid || taskid == null) return res.status(404).send("Informação da Tarefa Inválida.");
        try {
            const isAuthorized = await fetch('http://10.96.18.2/api/auth/isAuthorized', {credentials: 'include', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${req.cookies?.clientToken}` }});
            if (!isAuthorized.ok) { return res.status(400).json({ message: "Sessão Inválida, Sem Acesso." });}
            try {
                const results = await sqlQuery("DELETE FROM tasks WHERE id=?", [taskid]);
                return res.status(200).json(results);
            } catch (error) {
                return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message});
            }
        } catch (error) {
            return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message});
        }
    } catch (error) {
        return res.status(500).json({message: 'Ocorreu um Erro: ' + error.message});
    }
});

module.exports = routes;