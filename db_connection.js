/*maneja la conexion a la base de datos y la creacion de vistas*/

//Se importa modulo mysql2 con "/promise" para que maneje operaciones asincronas
import mysql from 'mysql2/promise';


//conexion con la base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Qwe.123*',
    database: 'gestion_academica_universidad'
};

// Un pool gestiona múltiples conexiones, lo que es más eficiente para un servidor.
//evita mysql.createConnection y conecction.query
export const pool = mysql.createPool(dbConfig);




