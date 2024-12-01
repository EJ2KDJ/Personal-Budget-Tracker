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

// Middleware to check if envelope exists
const findEnvelopeById = (req, res, next) => {
    const envelopeID = Number(req.params.id);

    const foundEnvelope = envelope.find(env => env.id === envelopeID);

    if (!foundEnvelope) {
        return res.status(404).json({message: 'Envelope not found'});
    }

    req.foundEnvelope = foundEnvelope;

    next();
}


// Api create envelope
app.post('/api/envelope', (req, res, next) => {
    const {title, budget} = req.body;

    if (!title || !budget) {
        return res.status(400).json({
            error: "Title and Budget required" 
        });
    }

    // New envelope
    const newEnvelope = {
        id: envelope.length + 1,
        title: title,
        budget: budget
    };

    // Push to envelope array
    envelope.push(newEnvelope);

    res.status(201).json({
        message: 'Envelop created',
        envelope: newEnvelope
    });
});


// Get all envelopes
app.get('/api/envelope', (req, res, next) => {
    res.json(envelope);
});

//Get specific envelope
app.get('/api/envelope/:id', findEnvelopeById, (req, res) => {
    res.json(req.foundEnvelope);
});

// Update envelope
app.put("/api/envelope/:id", findEnvelopeById, (req, res) => {
    const envelopeToUpdate = req.foundEnvelope;
    const { title, budget, withdrawal} = req.body;

    if (!title && budget === undefined && withdrawal === undefined) {
        return res.status(400).json({
            error: "must provide title, budget, or withdrawal amount to update"
        });
    }

    if (title) {
        envelopeToUpdate.title = title;
    }
    if (budget) {
        envelopeToUpdate.budget = budget;
    }
    if (withdrawal !== undefined) {
        if(withdrawal <= 0) {
            return res.status(400).json({
                error: "Withdrawal amount must be greater than 0"
            })
        }
        if(withdrawal > envelopeToUpdate.budget) {
            return res.status(400).json({
                error: "Insufficient budget for this withdrawal amount"
            })
        }
    }


    res.json({
        message: "Envelope updates successfully",
        envelope: envelopeToUpdate
    })
});

// Get request hello
app.use("/",(req, res, next) => {
    res.send("Hello World");
});

// Server Start
app.listen(PORT, (req, res, next) => {
    console.log(`Server is running on port ${PORT}`);
});
