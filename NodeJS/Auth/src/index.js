const express = require('express');
const app = express();
const cors = require('cors');
const auth = require('./auth');
app.use(express.json());
app.use('/api/v1/auth', auth);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: 'http://10.96.18.2', credentials: true}));


app.listen(2500, () => { console.log('> Auth System on: http://localhost:2500') })