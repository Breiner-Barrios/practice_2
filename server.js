//importacion de Express
import express from 'express';
const app = express();

import { pool } from './db_connection.js';
import { createApiViewIfNotExist, estudianteViewQuery } from './viewsSQL.js';
import setupRoutes from './routes.js';

const PORT = 3000;


//Esto es importante para que tu página HTML (que estará en un origen diferente)
// pueda hacer solicitudes a este servidor.
import cors from 'cors';
app.use(cors())




// Middleware para parsear cuerpos de solicitud JSON.
// Esto es necesario para manejar los datos enviados en solicitudes POST y PUT.
app.use(express.json());


// Inicia el servidor solo después de asegurarse de que las VIEWS existen
(async () => {
    try {
        await createApiViewIfNotExist('vista_estudiantes_api', estudianteViewQuery);
    } catch (error) {
        console.error('No se pudo iniciar la aplicación debido a un error de base de datos.');
        process.exit(1);
    }

    // Configura todas las rutas pasando la instancia de la app y el pool de conexiones
    setupRoutes(app, pool);

    // Inicia el servidor
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
        console.log(`Para ver los datos de estudiantes, visita: http://localhost:${PORT}/api/estudiantes`);
    });
})();
