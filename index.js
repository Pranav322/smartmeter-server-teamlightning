require("dotenv").config();
const connectToMongo = require('./db');
const cors = require('cors');
const express = require('express');

const updateDataRoute = require('./Routes/data');

connectToMongo();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./Routes/auth'));
app.use(updateDataRoute);
app.use('/api/userElectricity', updateDataRoute);

const server = app.listen(port, () => {
      console.log(`smartMeter - Backend listening on http://127.0.0.1:${port}`);
});


module.exports = { app, server }; // Export the components for potential reuse