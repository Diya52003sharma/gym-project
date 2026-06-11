const express = require('express');
const app = express();
const PORT = 5000;

require("dotenv").config();
const cors = require('cors');
const path = require("path");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database
require('./server/config/db');
require('./server/config/seed');

// Static files
app.use(express.static('server/public/'));

// API Routes
const adminRoutes = require('./server/routes/adminRoutes');
app.use('/admin', adminRoutes);

const customerRoutes = require('./server/routes/customerRoutes');
app.use('/customer', customerRoutes);

const trainerRoutes = require('./server/routes/trainerRoutes');
app.use('/trainer', trainerRoutes);

// Serve React build
app.use(express.static(path.join(__dirname, "dist")));

// React Router support
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Server Start
app.listen(PORT, (error) => {
    if (error) {
        console.log("Error in server", error);
    } else {
        console.log("Server is running at port", PORT);
    }
});