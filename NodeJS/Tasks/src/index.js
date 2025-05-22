const express = require('express');
const app = express();
const tasks = require('./tasks');
app.use(express.json());
app.use('/api/v1/tasks', tasks);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(4000, () => { console.log('> Tasks System on: http://localhost:4000') })