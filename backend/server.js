const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for the frontend to fetch data
app.use(express.json()); // Parse JSON request bodies

// API Endpoints

/**
 * GET /api/products
 * Fetches all products from the SQLite database and returns them as a JSON array.
 */
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM Product', [], (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err.message);
            res.status(500).json({ error: 'Internal server error while fetching products.' });
            return;
        }
        res.json(rows);
    });
});

/**
 * GET /api/products/:id
 * Fetches a single product by its ID.
 */
app.get('/api/products/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM Product WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error(`Error fetching product ${id}:`, err.message);
            res.status(500).json({ error: 'Internal server error while fetching the product.' });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Product not found.' });
            return;
        }
        res.json(row);
    });
});

/**
 * POST /api/orders
 * Receives cart items and total price to process a mock order.
 */
app.post('/api/orders', (req, res) => {
    const { items, total } = req.body;
    
    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Order cannot be empty.' });
    }

    // Generate a mock order ID
    const orderId = Math.floor(Math.random() * 1000000);
    
    console.log(`\n=== NEW ORDER RECEIVED ===`);
    console.log(`Order ID: ${orderId}`);
    console.log(`Total: $${total.toFixed(2)}`);
    console.log(`Items: ${items.map(i => i.name).join(', ')}`);
    console.log(`==========================\n`);

    res.json({ 
        message: "Order placed successfully!", 
        orderId: orderId 
    });
});

// Start the server
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
app.listen(PORT, () => {
    console.log(`Server is running locally on http://localhost:${PORT}`);
});
