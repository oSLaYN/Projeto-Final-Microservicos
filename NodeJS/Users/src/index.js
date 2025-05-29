const express = require('express');
const app = express();
const users = require('./users');
app.use(express.json());
app.use('/api/v1/users', users);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(3000, () => { console.log('> Users System on: http://localhost:3000') })