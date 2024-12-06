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
        message: 'Envelope created',
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

        envelopeToUpdate.budget -= withdrawal;
    }


    res.json({
        message: "Envelope updated successfully",
        envelope: envelopeToUpdate
    })
});

// Delete Envelope routes
app.delete('/api/envelope/:id', findEnvelopeById, (req, res) => {
    const cleanEnvArray = envelope.filter((env) => env !== req.foundEnvelope);

    envelope.length = 0;
    envelope.push(...cleanEnvArray);

    res.status(204).send();
})

//Post route for transferring one envelope to another
app.post('/api/envelope/transfer/:from/:to', (req, res) => {
    const {from, to} = req.params;
    const {transfer} = req.body;

    //Validate transfer amount

    if (!transfer || transfer <=0) {
        return res.status(400).json({
            error: "Valid transfer amount required"
        });
    }

    const findEnvelopeFrom = envelope.find((env) => env.title.toLowerCase() === from.toLowerCase());
    const findEnvelopeTo = envelope.find((env) => env.title.toLowerCase() === to.toLowerCase());

    //Check if envelope titles exist
    if (!findEnvelopeFrom || !findEnvelopeTo) {
        return res.status(404).json({
            error: "Envelope title does not exist"
        });
    }

    //Check if amount is within envelope budget from transfer envelope
    if (findEnvelopeFrom.budget < transfer) {
        return res.status(400).json({
            error: "Insufficient funds from transfer envelope"
        });
    }

    findEnvelopeFrom.budget -= transfer;
    findEnvelopeTo.budget += transfer;

    res.json({
        message: `Transfer from ${from} successfully transferred to ${to}`,
        envelope: envelope
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
