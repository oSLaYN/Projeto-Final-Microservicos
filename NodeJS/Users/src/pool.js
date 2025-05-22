const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10, // adjust based on your needs
  host: '10.244.0.28',
  port: '30000',
  user: 'root',
  password: 'Kubernetes@',
  database: 'users'
});

pool.on('error', (err) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
    console.error('Reconnecting due to lost connection:', err);
  }
});

module.exports = pool;
