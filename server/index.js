const path = require('path');
const express = require('express');
//const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Have Node serve the files for our built React app
app.use(express.json());

// connection to database
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {});
const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const usersRouter = require('../routes/users.js');
const recipesRouter = require('../routes/recipes.js');

app.use('/users', usersRouter);
app.use('/recipes', recipesRouter);

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
