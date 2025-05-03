const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 5000;

// CORS configuration with specific options
const corsOptions = {
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

// Middleware to parse incoming requests
app.use(bodyParser.json());

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
if (!fs.existsSync(productsFilePath)) {
    console.error('Product data file not found!');
    process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsFilePath));

app.get('/products', (req, res) => {
    res.json(products);
});

app.post('/recommend', (req, res) => {
    console.time('responseTime'); // Start the timer
    const { skills } = req.body;

    if (!skills || skills.length === 0) {
        return res.status(400).json({ error: 'No skills provided' });
    }

    const recommendedProducts = products.filter(product =>
        product.skills.some(skill => skills.includes(skill))
    );

    if (recommendedProducts.length === 0) {
        return res.status(404).json({ message: 'No products found for the given skills' });
    }

    console.timeEnd('responseTime'); // End the timer and log the time taken
    res.json(recommendedProducts);
});


app.get('/', (req, res) => {
    res.send('Welcome to the SHL Assessment Recommendation Engine API!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
