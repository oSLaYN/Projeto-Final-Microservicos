const express = require('express');
const app = express();
const auth = require('./auth');
app.use(express.json());
app.use('/api/v1/auth', auth);

app.listen(3000, () => { console.log('> Auth System on: http://localhost:3000') })