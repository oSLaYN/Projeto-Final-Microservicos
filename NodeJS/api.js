import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();
var routes = express.Router();

routes.post('/register', async(req, res) => {

})

routes.post('/login', async(req, res) => {
    const username = (req.body && req.body.username ? req.body.username : null);
    const password = (req.body && req.body.password ? req.body.password : null);
    if (!username||!password) { res.status(400).send('Username ou Password Inválidos.')}
    console.log(username, password);
    res.status(200).json({ message: 'Credenciais Válidas!' });
});

export default routes;