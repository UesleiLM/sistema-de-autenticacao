const mysql = require('mysql2');
require('dotenv').config();

//Credenciais
const dbHost = process.env.DB_HOST
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbDatabase = process.env.DB_DATABASE

//conexão
const pool = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase
}).promise();

pool.getConnection()
.then(connection => {
    console.log("Conectado ao banco de dados!");
    connection.release();
})
.catch(err => {
    console.log("Erro ao conectar ao banco de dados: ", err);
});

module.exports  = pool;
