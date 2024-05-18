const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3001;  // Cambié el puerto a 3001 para que coincida con el original

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'tu_contraseña',  // Asegúrate de que esta contraseña es correcta
  database: 'servletlogin',
};

// Función para manejar el inicio de sesión
async function login(req, res) {
  const { usuario, clave } = req.query;

  // Validar que los parámetros usuario y clave están presentes
  if (!usuario || !clave) {
    return res.status(400).send('Faltan parámetros: usuario y/o clave');
  }

  try {
    // Crear una conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Ejecutar la consulta de manera segura usando parámetros
    const [filas] = await connection.execute(
      'SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?',
      [usuario, clave]
    );

    // Cerrar la conexión
    await connection.end();

    // Verificar si se encontró un usuario con las credenciales proporcionadas
    if (filas.length === 1) {
      res.send(`Bienvenido ${usuario}`);
    } else {
      res.send('Usuario o contraseña incorrecta');
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    res.status(500).send('Error de servidor');
  }
}

// Función para manejar el registro de nuevos usuarios
async function registrar(req, res) {
  const { usuario, clave } = req.query;

  // Validar que los parámetros usuario y clave están presentes
  if (!usuario || !clave) {
    return res.status(400).send('Faltan parámetros: usuario y/o clave');
  }

  try {
    // Crear una conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Ejecutar la consulta de inserción de manera segura usando parámetros
    const [result] = await connection.execute(
      'INSERT INTO usuarios (usuario, contraseña) VALUES (?, ?)',
      [usuario, clave]
    );

    // Cerrar la conexión
    await connection.end();

    // Responder con un mensaje de éxito
    res.send(`Usuario ${usuario} registrado exitosamente`);
  } catch (error) {
    console.error('Error de conexión:', error);
    res.status(500).send('Error de servidor');
  }
}

// Definir las rutas para el login y el registro
app.get('/login', login);
app.get('/registrar', registrar);

// Iniciar la aplicación en el puerto especificado
app.listen(port, () => {
  console.log(`Aplicación de ejemplo escuchando en el puerto ${port}`);
});