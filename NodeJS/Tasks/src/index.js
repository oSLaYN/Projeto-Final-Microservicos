const express = require('express');
const app = express();
const cors = require('cors');
const tasks = require('./tasks');
app.use(express.json());
app.use('/api/v1/tasks', tasks);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: 'http://10.96.18.2', credentials: true}));

app.listen(2750, () => { console.log('> Tasks System on: http://localhost:2750') })