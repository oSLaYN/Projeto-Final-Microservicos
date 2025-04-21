import express from 'express';
import routes from './api.js';
const app = express();
app.use(express.json());

app.use(express.static('public', {extensions: ['js']}));
app.use('/api/v1/', routes);

app.listen(6500, () => { console.log('> Started at http://localhost:6500') })