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


// Envelopes route
const envelope = [];

// Api create envelope
app.post('/api/envelop', (req, res, next) => {
    const {title, budget} = req.body;

    if (!title || !budget) {
        res.status(400).json({
            error: "Title and Budget required" 
        });
    }

    // New envelope
    const newEnvelop = {
        id: envelope + 1,
        title: title,
        budget: budget
    };

    // Push to envelope array
    envelope.push(newEnvelop);

    res.status(201).json({
        message: 'Envelop created',
        envelop: envelope
    });
});


// Get all envelopes
app.get('/api/envelope', (req, res, next) => {
    res.json(envelope);
});

//Get specific envelope
app.get('/api/envelope/:id', (req, res, next) => {
    //Parse envelopeID
    const envelopeID = Number(req.params.id);

    //Find with the matching ID
    const foundEnvelope = envelope.find(envelope => envelope.id === envelopeID);

    // Error Handlig if envelope exists
    if (foundEnvelope) {
        res.json(foundEnvelope);
    } else {
        res.status(404).json({message: 'Envelope not found'});
    }
});

// Get request hello
app.use("/",(req, res, next) => {
    res.send("Hello World");
});

// Server Start
app.listen(PORT, (req, res, next) => {
    console.log(`Server is running on port ${PORT}`);
});
