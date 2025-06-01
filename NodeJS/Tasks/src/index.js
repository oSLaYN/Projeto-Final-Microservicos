const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const tasks = require('./tasks');
const allowedOrigins = ['http://localhost', 'http://localhost:31000', 'http://localhost:32000', 'http://10.96.18.2', 'http://10.96.18.3', 'http://10.96.18.5'];

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `O CORS não permite o origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use('/api/v1/tasks', tasks);

app.listen(2750, () => { console.log('> Tasks System on: http://localhost:2750') })