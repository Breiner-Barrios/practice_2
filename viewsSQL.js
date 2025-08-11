import { pool } from "./db_connection.js";

async function createApiViewIfNotExist(viewName, selectQuery) {
    try {
        const createViewQuery = `
            CREATE OR REPLACE VIEW ${viewName} AS
            ${selectQuery};
        `;
        await pool.query(createViewQuery);
        console.log(`VIEW "${viewName}" ha sido creada o actualizada exitosamente.`);
    } catch (error) {
        console.error(` Error al crear la VIEW "${viewName}":`, error.message);
        // Si no se puede crear la VIEW, la aplicación no debería arrancar.
        process.exit(1); //Detiene el arranque (sin la vista no deberia arrancar el servidor)
    }
};

// Definen la consulta SELECT para las VIEWS

const estudianteViewQuery = `
    SELECT
        id_estudiante AS id,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        correo,
        genero,
        identificacion,
        carrera,
        fecha_nacimiento,
        fecha_ingreso
    FROM estudiantes
`;

// Exporta las consultas y la función para su uso en el archivo principal
export {
    createApiViewIfNotExist,
    estudianteViewQuery
};