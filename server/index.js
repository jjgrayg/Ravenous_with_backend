// server/index.js
const path = require('path');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.API_KEY;

const PORT = process.env.PORT || 3000;

const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api/business", async (req, res) => {
    const baseURL = 'https://api.yelp.com/v3/businesses/search?term='
    const term = req.query.term;
    let optionalParams = '';
    if (req.query.location) {
        optionalParams += `&location=${req.query.location}`;
    }
    if (req.query.latitude && req.query.longitude) {
        optionalParams += `&latitude=${req.query.latitude}&longitude=${req.query.longitude}`;
    }
    const yelpRes = await axios({
        method: 'get',
        url: baseURL + term + optionalParams,
        headers: { Authorization: `Bearer ${apiKey}` }
    });
    res.json(yelpRes.data);
});

// All other GET requests not handled before will return our React app
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.get("/api/autocomplete", async (req, res) => {
    const baseURL = 'https://api.yelp.com/v3/autocomplete?text='
    const text = req.query.text;
    let optionalParams = '';
    if (req.query.latitude && req.query.longitude) {
        optionalParams = `&latitude=${encodeURI(req.query.latitude)}&longitude=${encodeURI(req.query.longitude)}`
    }
    const yelpRes = await axios({
        method: 'get',
        url: baseURL + text + optionalParams,
        headers: { Authorization: `Bearer ${apiKey}` }
    });
    res.json(yelpRes.data);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});