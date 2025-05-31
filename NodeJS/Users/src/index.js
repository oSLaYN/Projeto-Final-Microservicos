const express = require('express');
const app = express();
const cors = require('cors');
const users = require('./users');
app.use(express.json());
app.use('/api/v1/users', users);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: 'http://10.96.18.2', credentials: true}));

app.listen(3000, () => { console.log('> Users System on: http://localhost:3000') })