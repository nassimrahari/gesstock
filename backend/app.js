
const express = require('express');
const authMiddleware = require('./middlewares/authMiddleware'); // Import the middleware

const SupplierRoutes = require('./routes/supplierRoutes');
const CategoryRoutes = require('./routes/categoryRoutes');
const ProductRoutes = require('./routes/productRoutes');
const PurchaseRoutes = require('./routes/purchaseRoutes');
const PurchaseLineRoutes = require('./routes/purchaselineRoutes');
const ClientRoutes = require('./routes/clientRoutes');
const SaleRoutes = require('./routes/saleRoutes');
const SaleLineRoutes = require('./routes/salelineRoutes');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const countsRoutes = require('./routes/countsRoutes');
const bodyParser = require("body-parser");
const app = express();


// For parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// For parsing application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // Respond with 200 OK for OPTIONS requests
    }
    next();
});


// Serve static files from the public directory
app.use(express.static('public'));

// Serve files downloaded
app.use('/uploads', express.static('uploads'));


// Routes
// Routes d'authentification
app.use('/api/auth', authRoutes);
app.use('/api/counts', countsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suppliers',authMiddleware, SupplierRoutes);
app.use('/api/categorys',authMiddleware, CategoryRoutes);
app.use('/api/products',authMiddleware, ProductRoutes);
app.use('/api/purchases',authMiddleware, PurchaseRoutes);
app.use('/api/purchaselines',authMiddleware, PurchaseLineRoutes);
app.use('/api/clients',authMiddleware, ClientRoutes);
app.use('/api/sales',authMiddleware, SaleRoutes);
app.use('/api/salelines',authMiddleware, SaleLineRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
