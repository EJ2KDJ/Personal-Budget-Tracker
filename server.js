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


// envelopes route
const envelope = [];

// Api create envelop
app.use('/api/envelop', (req, res, next) => {
    const {title, budget} = req.body;

    if (!title || !budget) {
        res.status(400).json({
            error: "Title and Budget required" 
        });
    }

    // new envelop
    const newEnvelop = {
        id: envelop + 1,
        title: title,
        budget: budget
    };

    // push to envelope array
    envelop.push(newEnvelop);

    res.status(201).json({
        message: 'Envelop created',
        envelop: envelope
    });
});


// Get all envelopes
app.get('/api/envelope', (req, res, next) => {
    res.json(envelope);
});

// Get request hello
app.use("/",(req, res, next) => {
    res.send("Hello World");
});
// Server Start
app.listen(PORT, (req, res, next) => {
    console.log(`Server is running on port ${PORT}`);
});
