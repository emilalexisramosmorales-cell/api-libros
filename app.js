// app.js - API REST básica de Libros con Node.js y Express
// Bloque 3 - Actividad 1 - Tablero colaborativo en tiempo real

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar JSON en el cuerpo de las solicitudes
app.use(express.json());

// ---------------------------------------------------------------
// "Base de datos" en memoria: arreglo de objetos
// Campos: id (número), nombre (cadena), anio (número)
// ---------------------------------------------------------------
const libros = [
  { id: 1, nombre: 'Cien años de soledad', anio: 1967 },
  { id: 2, nombre: 'Don Quijote de la Mancha', anio: 1605 },
  { id: 3, nombre: 'El principito', anio: 1943 },
  { id: 4, nombre: 'La sombra del viento', anio: 2001 },
  { id: 5, nombre: 'Rayuela', anio: 1963 },
  { id: 6, nombre: 'El amor en los tiempos del cólera', anio: 1985 },
  { id: 7, nombre: 'Pedro Páramo', anio: 1955 },
  { id: 8, nombre: 'Cien años de perdón', anio: 2020 }
];

// ---------------------------------------------------------------
// Ruta estática raíz: información general de la API (JSON)
// GET /
// ---------------------------------------------------------------
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Libros con Node.js y Express',
    endpoints: {
      listar: 'GET /libros',
      todosEnJson: 'GET /api/libros',
      buscarPorNombre: 'GET /libros/buscar?nombre=texto',
      detallePorId: 'GET /libros/:id'
    }
  });
});

// ---------------------------------------------------------------
// 1) Listar todos los libros
// GET /libros
// ---------------------------------------------------------------
app.get('/libros', (req, res) => {
  res.status(200).json({
    total: libros.length,
    libros: libros
  });
});

// ---------------------------------------------------------------
// 2) Ruta que devuelve un JSON con todos los libros disponibles
// GET /api/libros
// ---------------------------------------------------------------
app.get('/api/libros', (req, res) => {
  res.status(200).json(libros);
});

// ---------------------------------------------------------------
// 3) Buscar libros por nombre (parámetro de consulta / query string)
// GET /libros/buscar?nombre=cien
// IMPORTANTE: debe ir ANTES de /libros/:id, de lo contrario Express
// interpretaría la palabra "buscar" como si fuera un ID.
// ---------------------------------------------------------------
app.get('/libros/buscar', (req, res) => {
  const { nombre } = req.query;

  // Validación: el parámetro es obligatorio
  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({
      error: 'Debe enviar el parámetro de consulta "nombre". Ejemplo: /libros/buscar?nombre=cien'
    });
  }

  // Búsqueda sin distinguir mayúsculas/minúsculas ni tildes
  const normalizar = (texto) =>
    texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const termino = normalizar(nombre.trim());
  const resultados = libros.filter((libro) =>
    normalizar(libro.nombre).includes(termino)
  );

  if (resultados.length === 0) {
    return res.status(404).json({
      error: `No se encontraron libros que coincidan con "${nombre}"`
    });
  }

  res.status(200).json({
    busqueda: nombre,
    total: resultados.length,
    libros: resultados
  });
});

// ---------------------------------------------------------------
// 4) Obtener los detalles de un libro por ID (ruta dinámica)
// GET /libros/:id
// ---------------------------------------------------------------
app.get('/libros/:id', (req, res) => {
  const id = Number(req.params.id);

  // Validación: el ID debe ser un número entero positivo
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'El ID debe ser un número entero positivo'
    });
  }

  const libro = libros.find((l) => l.id === id);

  if (!libro) {
    return res.status(404).json({
      error: `Libro con id ${id} no encontrado`
    });
  }

  res.status(200).json(libro);
});

// ---------------------------------------------------------------
// Manejo de rutas inexistentes (404) - siempre responde JSON
// ---------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// ---------------------------------------------------------------
// Manejo general de errores del servidor (500) - siempre JSON
// ---------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ---------------------------------------------------------------
// Iniciar el servidor
// ---------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// ---------------------------------------------------------------
// Link del sitio (reemplazar por el enlace real de tu publicación
// o repositorio antes de entregar):
// LINK DEL SITIO: https://REEMPLAZA-ESTE-LINK.com
// ---------------------------------------------------------------
