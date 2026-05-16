const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

// Initialize database schema and seed data
function initDb() {
    db.serialize(() => {
        // Create Product table
        db.run(`
            CREATE TABLE IF NOT EXISTS Product (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                price REAL NOT NULL,
                imageUrl TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('Error creating Product table:', err.message);
            } else {
                console.log('Product table ready.');
                seedData();
            }
        });
    });
}

// Seed initial data if the database is empty
function seedData() {
    db.get('SELECT COUNT(*) AS count FROM Product', (err, row) => {
        if (err) {
            console.error('Error checking products count:', err.message);
            return;
        }

        if (row.count === 0) {
            console.log('Database is empty. Seeding mock data...');
            const insertStmt = db.prepare(`
                INSERT INTO Product (name, description, price, imageUrl) 
                VALUES (?, ?, ?, ?)
            `);

            const mockProducts = [
                {
                    name: 'Wireless Noise-Canceling Headphones',
                    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound.',
                    price: 299.99,
                    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'Smart Home Security Camera',
                    description: '1080p HD indoor security camera with motion detection, two-way audio, and night vision.',
                    price: 89.99,
                    imageUrl: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'Mechanical Gaming Keyboard',
                    description: 'RGB backlit mechanical keyboard with tactile switches for fast response and durability.',
                    price: 129.50,
                    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'Ultra-Thin Laptop',
                    description: 'Lightweight 14-inch laptop with latest gen processor, 16GB RAM, and 512GB SSD for optimal productivity.',
                    price: 1199.00,
                    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'Portable Power Bank',
                    description: '20000mAh high-capacity portable charger with fast-charging technology and dual USB output.',
                    price: 45.00,
                    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'Wireless Gaming Mouse',
                    description: 'Ergonomic wireless gaming mouse with 16,000 DPI optical sensor and customizable RGB lighting.',
                    price: 79.99,
                    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: '4K Ultrawide Monitor',
                    description: '34-inch curved ultrawide monitor with 4K resolution, 144Hz refresh rate, and 1ms response time.',
                    price: 649.00,
                    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'Premium Tablet Pro',
                    description: '11-inch liquid retina display tablet with M1 chip, pencil support, and all-day battery life.',
                    price: 799.00,
                    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'Fitness Smartwatch',
                    description: 'Water-resistant smartwatch with heart rate tracking, GPS, and advanced sleep monitoring.',
                    price: 199.50,
                    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80'
                }
            ];

            mockProducts.forEach(product => {
                insertStmt.run(product.name, product.description, product.price, product.imageUrl, (err) => {
                    if (err) {
                        console.error('Error inserting seed data:', err.message);
                    }
                });
            });

            insertStmt.finalize();
            console.log('Seed data inserted successfully.');
        } else {
            console.log(`Database already has ${row.count} products.`);
        }
    });
}

module.exports = db;
