const express = require('express');
const app = express();
var routes = express.Router();
const util = require('util');
const sql = require('./pool');
const sqlQuery = util.promisify(sql.query).bind(sql);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

routes.get("/getTasks", async (req, res) => {
    try {
        const userid = (req.query && req.query.userid ? req.query.userid : null)
        if (!userid || userid==null) return res.status(404).send("ID de Utilizador Inválido.");
        try {
            const isAuthorized = await fetch('localhost:31000/api/v1/auth/isAuthorized');
            if (!isAuthorized) { return res.status(400).send("Sessão Inválida, Sem Acesso.")}
            try {
                const {err, results} = await sqlQuery("SELECT * FROM tasks WHERE userid = ?", [userid]);
                if (err) return res.status(500).send("Ocorreu um Erro: "+err.message);
                return res.status(200).json(results);
            } catch (error) {
                return res.status(500).send('Ocorreu um Erro: '+ error);
            }
        } catch (error) {
            return res.status(500).send('Ocorreu um Erro: '+ error);
        }
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro: '+ error);
    }
});

routes.post("/createTask", async (req, res) => {
    try {
        const {userid, title, description} = req.body;
        try {
            const isAuthorized = await fetch('localhost:31000/api/v1/auth/isAuthorized');
            if (!isAuthorized) { return res.status(400).send("Sessão Inválida, Sem Acesso.")}
            try {
                const user = await fetch(`localhost:33000/api/v1/users/getUserByID?id=${userid}`);
                if (!user) { return res.status(404).send("Utilizador Inválido.") };
                try {
                    const {err, results} = await sqlQuery("INSERT INTO tasks (?, ?, ?, ?) VALUES (userid, title, description, done)", [userid, title, description, 0]);
                    if (err) return res.status(500).send('Ocorreu um Erro:'+err.message);
                    return res.status(200).json(results);
                } catch (error) {
                    return res.status(500).send('Ocorreu um Erro:'+error);
                }
            } catch (error) {
                return res.status(500).send('Ocorreu um Erro:'+error);
            }
        } catch (error) {
            return res.status(500).send('Ocorreu um Erro:'+error);
        }
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro:'+error);
    }
});

routes.post("/updateTask", async (req, res) => {
    try { 
        const {taskid, tasktitle, taskinfo, taskstatus} = req.body;
        try {
            const isAuthorized = await fetch('localhost:31000/api/v1/auth/isAuthorized');
            if (!isAuthorized) { return res.status(400).send("Sessão Inválida, Sem Acesso.")}
            try {
                const {err, results} = await sqlQuery("UPDATE tasks SET title=?, description=?, done=? WHERE id=?", [tasktitle, taskinfo, taskstatus, taskid]);
                if (err) return res.status(500).send('Ocorreu um Erro:'+err.message);
                return res.status(200).json(results);
            } catch (error) {
                return res.status(500).send('Ocorreu um Erro:'+error);
            }
        } catch (error) {
            return res.status(500).send('Ocorreu um Erro:'+error);
        }
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro:'+error);
    }
});

routes.delete("/deleteTask", async (req, res) => {
    try {
        const taskid = (req.query && req.query.taskid ? req.query.taskid : null)
        if (!taskid || taskid == null) return res.status(404).send("Informação da Tarefa Inválida.");
        try {
            const isAuthorized = await fetch('localhost:31000/api/v1/auth/isAuthorized');
            if (!isAuthorized) { return res.status(400).send("Sessão Inválida, Sem Acesso.")}
            try {
                const {err, results} = await sqlQuery("DELETE FROM tasks WHERE id=?", [taskid]);
                if (err) return res.status(500).send('Ocorreu um Erro:'+err.message);
                return res.status(200).json(results);
            } catch (error) {
                return res.status(500).send('Ocorreu um Erro:'+error);
            }
        } catch (error) {
            return res.status(500).send('Ocorreu um Erro:'+error);
        }
    }
});

module.exports = routes;