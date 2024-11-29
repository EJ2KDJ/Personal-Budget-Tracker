const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


// Get request hello
app.use("/",(req, res, next) => {
    res.send("Hello World");
});
// Server Start
app.listen(PORT, (req, res, next) => {
    console.log(`Server is running on port ${PORT}`);
});
