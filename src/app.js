const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

// Connecting Database
require('./db/conn');

// Using Environment File
dotenv.config({ path: '../config.env'});


// Declaring app to start using it
const app = express();
app.use(cors());
const PORT = process.env.PORT;

// Using app to different purposes
app.use(express.json());
app.use(require('./router/auth'));



app.listen(PORT, () => {
    console.log(`I am live now at ${PORT}!`)
})