const express = require('express');
const app = express();
var routes = express.Router();
const util = require('util');
const sql = require('./pool');
const sqlQuery = util.promisify(sql).bind(sql);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

routes.get("/getTasks/:userid", async (req, res) => {
    const userid = (req.params && req.params.userid ? req.params.userid : null)
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
});

routes.post("/createTask/:userid", async (req, res) => {
    const userid = (req.params && req.params.userid ? req.params.userid : null)
    const title = (req.query && req.query.title ? req.query.title : null)
    const description = (req.query && req.query.description ? req.query.description : null)
    if (!userid || userid==null) return res.status(404).send("ID de Utilizador Inválido.");
    if (!title || title == null || !description || description==null) return res.status(404).send("Informação da Tarefa Inválida.");
    try {
        const isAuthorized = await fetch('localhost:31000/api/v1/auth/isAuthorized');
        if (!isAuthorized) { return res.status(400).send("Sessão Inválida, Sem Acesso.")}
        try {
            const user = await fetch(`localhost:33000/api/v1/users/getUserByID?id=${userid}`);
            if (!user) { return res.status(404).send("Utilizador Inválido.") };
            try {
                const {err, results} = await sqlQuery("INSERT INTO tasks (?, ?) VALUES (userid, title, description)", [userid, task]);
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

routes.post("/updateTask/:taskid", async (req, res) => { 
    const taskid = (req.params && req.params.taskid ? req.params.taskid : null)
    const tasktitle = (req.query && req.query.tasktitle ? req.query.tasktitle : null)
    const taskinfo = (req.query && req.query.taskinfo ? req.query.taskinfo : null)
    const taskstatus = (req.query && req.query.taskstatus ? req.query.taskstatus : null)
    if (!taskid || taskid == null || !tasktitle || tasktitle == null || !taskinfo || taskinfo==null || !taskstatus || taskstatus == null) return res.status(404).send("Informação da Tarefa Inválida.");
    try {
        const isAuthorized = await fetch('localhost:31000/api/v1/auth/isAuthorized');
        if (!isAuthorized) { return res.status(400).send("Sessão Inválida, Sem Acesso.")}
        try {
            const {err, results} = await sqlQuery("UPDATE tasks SET task=?, done=? WHERE id=?", [taskinfo, taskstatus, taskid]);
            if (err) return res.status(500).send('Ocorreu um Erro:'+err.message);
            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).send('Ocorreu um Erro:'+error);
        }
    } catch (error) {
        return res.status(500).send('Ocorreu um Erro:'+error);
    }
});

routes.delete("/deleteTask/:taskid", async (req, res) => { 
    const taskid = (req.params && req.params.taskid ? req.params.taskid : null)
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
});

module.exports = routes;