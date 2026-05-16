# Simple E-commerce Store

This project is a simple E-commerce Store built for a software engineering internship. 
It features an Express.js (Node.js) backend with an SQLite database, and a vanilla HTML/CSS/JavaScript frontend.

## Project Structure

```
E-commerce/
├── backend/
│   ├── database.js     # SQLite database connection, schema definition, and seed data
│   ├── server.js       # Express server, CORS setup, and API routes
│   ├── package.json    # Node.js project metadata and dependencies
│   └── ecommerce.db    # SQLite database file (auto-generated)
├── frontend/           # (To be implemented) HTML/CSS/JS files for the UI
└── README.md           # Project documentation
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (comes with Node.js)

## Installation

1. Clone or download this repository.
2. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
   *(Dependencies: `express`, `cors`, `sqlite3`)*

## Running the Backend Locally

1. While in the `backend` directory, start the Express server:
   ```bash
   node server.js
   ```
2. The terminal should log:
   - "Connected to the SQLite database."
   - "Product table ready."
   - "Database is empty. Seeding mock data..." (On first run only)
   - "Server is running locally on http://localhost:3000"

## API Endpoints

The backend exposes a RESTful API to interact with the database.

### 1. Get All Products
- **URL**: `/api/products`
- **Method**: `GET`
- **Description**: Fetches all products from the SQLite database.
- **Response Example**:
  ```json
  [
    {
      "id": 1,
      "name": "Wireless Noise-Canceling Headphones",
      "description": "Premium over-ear headphones...",
      "price": 299.99,
      "imageUrl": "https://images.unsplash.com/..."
    },
    ...
  ]
  ```

### 2. Get Single Product
- **URL**: `/api/products/:id`
- **Method**: `GET`
- **Description**: Fetches a single product by its `id`.
- **Response Example (Success)**:
  ```json
  {
    "id": 1,
    "name": "Wireless Noise-Canceling Headphones",
    "description": "Premium over-ear headphones...",
    "price": 299.99,
    "imageUrl": "https://images.unsplash.com/..."
  }
  ```
- **Response Example (Not Found)**:
  ```json
  {
    "error": "Product not found."
  }
  ```
