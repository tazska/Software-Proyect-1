// ═══════════════════════════════════════════════════════════════
// BACKEND NODE.JS - PAPAS LOCAS
// Sistema de registro de ventas con Express y MySQL
// ═══════════════════════════════════════════════════════════════

// ========== PASO 1: Instalar dependencias ==========
// npm init -y
// npm install express mysql2 cors dotenv body-parser

// ========== PASO 2: Crear archivo .env ==========
// DB_HOST=localhost
// DB_USER=root
// DB_PASSWORD=tu_password
// DB_NAME=papas_locas_db
// PORT=3000

// ========== server.js ==========

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE LA BASE DE DATOS
// ═══════════════════════════════════════════════════════════════

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'user',
    database: process.env.DB_NAME || 'papas_locas_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Verificar conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.message);
        return;
    }
    console.log('✅ Conectado a la base de datos MySQL');
    connection.release();
});

// ═══════════════════════════════════════════════════════════════
// RUTAS DE LA API
// ═══════════════════════════════════════════════════════════════

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        mensaje: '🍟 API de Papas Locas funcionando correctamente',
        version: '1.0.0'
    });
});

// ═══════════════════════════════════════════════════════════════
// ENDPOINT: Obtener todos los productos
// ═══════════════════════════════════════════════════════════════
app.get('/api/productos', async (req, res) => {
    try {
        const [productos] = await promisePool.query(
            'SELECT * FROM productos WHERE activo = TRUE ORDER BY categoria, nombre'
        );
        
        res.json({
            success: true,
            data: productos
        });
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener productos',
            error: error.message
        });
    }
});

// ═══════════════════════════════════════════════════════════════
// ENDPOINT: Obtener un producto por nombre
// ═══════════════════════════════════════════════════════════════
app.get('/api/productos/buscar/:nombre', async (req, res) => {
    try {
        const { nombre } = req.params;
        const [productos] = await promisePool.query(
            'SELECT * FROM productos WHERE nombre = ? AND activo = TRUE',
            [nombre]
        );
        
        if (productos.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Producto no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: productos[0]
        });
    } catch (error) {
        console.error('Error buscando producto:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al buscar producto',
            error: error.message
        });
    }
});

// ═══════════════════════════════════════════════════════════════
// ENDPOINT PRINCIPAL: Registrar una venta completa
// ═══════════════════════════════════════════════════════════════
app.post('/api/ventas/registrar', async (req, res) => {
    const connection = await promisePool.getConnection();
    
    try {
        const {
            nombre,
            email,
            telefono,
            direccion,
            metodo_entrega,
            metodo_pago,
            productos,
            total
        } = req.body;

        // Validaciones básicas
        if (!nombre || !email || !telefono || !metodo_entrega || !metodo_pago || !productos || !total) {
            return res.status(400).json({
                success: false,
                mensaje: 'Faltan datos obligatorios'
            });
        }

        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'Debe incluir al menos un producto'
            });
        }

        // Iniciar transacción
        await connection.beginTransaction();

        // 1. Verificar si el cliente existe
        const [clientesExistentes] = await connection.query(
            'SELECT id_cliente FROM clientes WHERE telefono = ?',
            [telefono]
        );

        let id_cliente;

        if (clientesExistentes.length > 0) {
            // Cliente existe, actualizar datos
            id_cliente = clientesExistentes[0].id_cliente;
            await connection.query(
                'UPDATE clientes SET nombre_completo = ?, email = ?, direccion = ? WHERE id_cliente = ?',
                [nombre, email, direccion || null, id_cliente]
            );
        } else {
            // Cliente nuevo, insertar
            const [resultCliente] = await connection.query(
                'INSERT INTO clientes (nombre_completo, email, telefono, direccion) VALUES (?, ?, ?, ?)',
                [nombre, email, telefono, direccion || null]
            );
            id_cliente = resultCliente.insertId;
        }

        // 2. Insertar la venta
        const [resultVenta] = await connection.query(
            `INSERT INTO ventas (
                id_cliente, 
                metodo_entrega, 
                metodo_pago, 
                direccion_entrega, 
                subtotal, 
                total,
                estado
            ) VALUES (?, ?, ?, ?, ?, ?, 'Pendiente')`,
            [id_cliente, metodo_entrega, metodo_pago, direccion || null, total, total]
        );

        const id_venta = resultVenta.insertId;

        // 3. Insertar detalles de la venta
        for (const producto of productos) {
            // Buscar el id_producto por nombre
            const [productoData] = await connection.query(
                'SELECT id_producto, precio FROM productos WHERE nombre = ?',
                [producto.nombre]
            );

            if (productoData.length === 0) {
                throw new Error(`Producto no encontrado: ${producto.nombre}`);
            }

            const id_producto = productoData[0].id_producto;
            const precio_unitario = producto.precio;
            const subtotal = producto.cantidad * precio_unitario;

            await connection.query(
                'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                [id_venta, id_producto, producto.cantidad, precio_unitario, subtotal]
            );
        }

        // Confirmar transacción
        await connection.commit();

        // Respuesta exitosa
        res.status(201).json({
            success: true,
            mensaje: '¡Venta registrada exitosamente! 🎉',
            data: {
                id_venta,
                id_cliente,
                total,
                fecha_venta: new Date()
            }
        });

    } catch (error) {
        // Revertir transacción en caso de error
        await connection.rollback();
        console.error('Error registrando venta:', error);
        
        res.status(500).json({
            success: false,
            mensaje: 'Error al registrar la venta',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// ═══════════════════════════════════════════════════════════════
// ENDPOINT: Obtener todas las ventas
// ═══════════════════════════════════════════════════════════════
app.get('/api/ventas', async (req, res) => {
    try {
        const [ventas] = await promisePool.query(
            'SELECT * FROM vista_ventas_completas ORDER BY fecha_venta DESC LIMIT 50'
        );
        
        res.json({
            success: true,
            data: ventas
        });
    } catch (error) {
        console.error('Error obteniendo ventas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener ventas',
            error: error.message
        });
    }
});

// ═══════════════════════════════════════════════════════════════
// ENDPOINT: Obtener detalle de una venta específica
// ═══════════════════════════════════════════════════════════════
app.get('/api/ventas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Obtener información de la venta
        const [venta] = await promisePool.query(
            `SELECT v.*, c.nombre_completo, c.email, c.telefono 
             FROM ventas v 
             INNER JOIN clientes c ON v.id_cliente = c.id_cliente 
             WHERE v.id_venta = ?`,
            [id]
        );

        if (venta.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Venta no encontrada'
            });
        }

        // Obtener detalles de productos
        const [detalles] = await promisePool.query(
            `SELECT dv.*, p.nombre as producto_nombre 
             FROM detalle_ventas dv 
             INNER JOIN productos p ON dv.id_producto = p.id_producto 
             WHERE dv.id_venta = ?`,
            [id]
        );

        res.json({
            success: true,
            data: {
                venta: venta[0],
                productos: detalles
            }
        });
    } catch (error) {
        console.error('Error obteniendo detalle de venta:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener detalle de venta',
            error: error.message
        });
    }
});

// ═══════════════════════════════════════════════════════════════
// ENDPOINT: Estadísticas del día
// ═══════════════════════════════════════════════════════════════
app.get('/api/estadisticas/hoy', async (req, res) => {
    try {
        const [stats] = await promisePool.query(
            `SELECT 
                COUNT(*) as total_ventas,
                SUM(total) as ingresos_totales,
                AVG(total) as ticket_promedio
             FROM ventas 
             WHERE DATE(fecha_venta) = CURDATE() 
             AND estado != 'Cancelado'`
        );
        
        res.json({
            success: true,
            data: stats[0]
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener estadísticas',
            error: error.message
        });
    }
});

// ═══════════════════════════════════════════════════════════════
// INICIAR SERVIDOR
// ═══════════════════════════════════════════════════════════════
app.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════');
    console.log('🍟 Servidor de Papas Locas iniciado');
    console.log(`🚀 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log('═══════════════════════════════════════════════');
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
    pool.end((err) => {
        console.log('\n👋 Cerrando conexiones a la base de datos...');
        process.exit(err ? 1 : 0);
    });
});