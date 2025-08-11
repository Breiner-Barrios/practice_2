// routes.js
// Archivo que define todas las rutas de la API.


//esos parametros los va a recibir en el index.js
const setupRoutes = (app, pool) => {
    // --- Rutas de la API para operaciones CRUD en estudiantes ---
    // ¡IMPORTANTE! Las rutas más específicas deben ir primero.

    // OPERACIONES CRUD
    
    //esto es para probar vistas
    app.get('/api/estudiantes/historial', async (req, res) => {
        try {
            // rows va entre [] para desectucturar los array que devuelve pool.query
            //pool.query devuelve un array con datos de la tabla y con metadatos como (nombre, tipo de dato y demas)
            //[rows] solo toma lo primero (datos)
            const [rows] = await pool.query(
                `SELECT * FROM historial_academico;`
            );

            //respuesta de la BD a JSON
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener estudiantes:', error.message);
            res.status(500).json({ message: 'Error interno del servidor al obtener estudiantes.' });
        }
    });

    // RUTA E: Obtener un solo estudiante por ID (READ) End point especial.
    app.get('/api/estudiantes/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const [rows] = await pool.query(
                'SELECT id_estudiante AS id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, correo, genero, identificacion, carrera, fecha_nacimiento, fecha_ingreso FROM estudiantes WHERE id_estudiante = ?', [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Estudiante no encontrado.' });
            }

            res.json(rows[0]);
        } catch (error) {
            console.error('Error al obtener estudiante:', error.message);
            res.status(500).json({ message: 'Error interno del servidor al obtener el estudiante.' });
        }
    });


    //READ
    app.get('/api/estudiantes', async (req, res) => {
        try {
            // rows va entre [] para desectucturar los array que devuelve pool.query
            //pool.query devuelve un array con datos de la tabla y con metadatos como (nombre, tipo de dato y demas)
            //[rows] solo toma lo primero (datos)
            const [rows] = await pool.query(
                'SELECT id_estudiante AS id, CONCAT(primer_nombre, " ", primer_apellido) AS estudiante, carrera, correo FROM estudiantes'
            );

            //respuesta de la BD a JSON
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener estudiantes:', error.message);
            res.status(500).json({ message: 'Error interno del servidor al obtener estudiantes.' });
        }
    });



    //CREATE //post usa req.body
    app.post('/api/estudiantes', async (req, res) => {
        const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
            correo, genero, identificacion, carrera, fecha_nacimiento, fecha_ingreso } = req.body


        if (!primer_nombre || !primer_apellido || !correo || !genero || !identificacion) {
            return res.status(400).json({ message: 'Campos obligatorios deben ser proporcionados.' });
        }

        try {
            const [result] = await pool.query(
                `INSERT INTO estudiantes 
            (primer_nombre, 
            segundo_nombre, 
            primer_apellido, 
            segundo_apellido, 
            correo, 
            genero, 
            identificacion, 
            carrera,
            fecha_nacimiento,
            fecha_ingreso
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, correo, genero, identificacion, carrera, fecha_nacimiento, fecha_ingreso]
            );

            // Devuelve el ID del nuevo estudiante insertado
            res.status(201).json({ message: 'Estudiante creado exitosamente.', id: result.insertId });
        } catch (error) {
            console.error('Error al crear estudiante:', error.message);
            // Manejo de error específico para identificación duplicada
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'La identificación proporcionada ya existe.' });
            }
            res.status(500).json({ message: 'Error interno del servidor al crear estudiante.' });
        }

    });

    // RUTA 3: Actualizar un estudiante existente (UPDATE) // PUT usa reequest.params // Se actualiza por medio del endpoint (:id)
    app.put('/api/estudiantes/:id', async (req, res) => {
        const { id } = req.params; // Obtiene el ID del estudiante de la URL (los parametros de la URL)
        const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, correo,
            genero, identificacion, carrera, fecha_nacimiento, fecha_ingreso } = req.body;

        // Validación básica de datos
        if (!primer_nombre || !primer_apellido || !correo || !genero || !identificacion || !fecha_nacimiento || !fecha_ingreso) {
            return res.status(400).json({ message: 'Todos los campos obligatorios deben ser proporcionados.' });
        }

        try {
            const [result] = await pool.query(
                'UPDATE estudiantes SET primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, correo = ?, genero = ?, identificacion = ?, carrera = ?, fecha_nacimiento = ?, fecha_ingreso = ? WHERE id_estudiante = ?',
                [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, correo, genero, identificacion, carrera, fecha_nacimiento, fecha_ingreso, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Estudiante no encontrado.' });
            }
            res.status(200).json({ message: 'Estudiante actualizado exitosamente.' });
        } catch (error) {
            console.error('Error al actualizar estudiante:', error.message);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'La identificación proporcionada ya existe para otro estudiante.' });
            }
            res.status(500).json({ message: 'Error interno del servidor al actualizar estudiante.' });
        }
    });

    // RUTA 5: Eliminar un estudiante (DELETE)
    app.delete('/api/estudiantes/:id', async (req, res) => {
        const { id } = req.params; // Obtiene el ID del estudiante de la URL

        try {
            const [result] = await pool.query(
                'DELETE FROM estudiantes WHERE id_estudiante = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Estudiante no encontrado.' });
            }
            res.status(200).json({ message: 'Estudiante eliminado exitosamente.' });
        } catch (error) {
            console.error('Error al eliminar estudiante:', error.message);
            res.status(500).json({ message: 'Error interno del servidor al eliminar estudiante.' });
        }
    });

};

export default setupRoutes;