// backend/server.js
const express = require('express');
const cors = require('cors');
const ecfrFetcher = require('./ecfrFetcher');
const crypto = require('crypto');


const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the eCFR API backend');
});

// Endpoint to fetch and store eCFR data
app.get('/api/fetch-ecfr', async (req, res) => {
  try {
    await ecfrFetcher.fetchAndStoreECFRData();
    res.status(200).send('eCFR data fetched and stored successfully.');
  } catch (error) {
    console.error('Error fetching eCFR data:', error);
    res.status(500).send('Failed to fetch eCFR data.');
  }
});

// List all agencies (titles)
app.get('/api/agencies', async (req, res) => {
  try {
    const data = await ecfrFetcher.getStoredECFRData();
    const agencies = data.titles.map((title) => ({
      number: title.number,
      name: title.name,
      latest_issue_date: title.latest_issue_date,
      up_to_date_as_of: title.up_to_date_as_of,
      reserved: title.reserved,
    }));
    res.json(agencies);
  } catch (error) {
    console.error('Error listing agencies:', error);
    res.status(500).send('Failed to list agencies');
  }
});

// Get word count for a specific agency (title)
app.get('/api/agency/:id/wordcount', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ecfrFetcher.getStoredECFRData();

    const agency = data.titles.find((title) => title.number === parseInt(id));
    
    if (!agency) {
      return res.status(404).json({ error: 'Agency not found' });
    }

    // Simulated word count based on title number (for now)
    const fakeWordCount = agency.name.length * 1000;

    res.json({
      agency: agency.name,
      titleNumber: agency.number,
      wordCount: fakeWordCount,
    });
  } catch (error) {
    console.error('Error getting word count:', error);
    res.status(500).send('Failed to get word count');
  }
});

// Get historical change (days since last amendment) for a specific agency (title)
app.get('/api/agency/:id/historical-change', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ecfrFetcher.getStoredECFRData();

    const agency = data.titles.find((title) => title.number === parseInt(id));

    if (!agency) {
      return res.status(404).json({ error: 'Agency not found' });
    }

    if (!agency.latest_amended_on || !agency.up_to_date_as_of) {
      return res.status(400).json({ error: 'Amendment or update date missing' });
    }

    const latestAmended = new Date(agency.latest_amended_on);
    const upToDateAsOf = new Date(agency.up_to_date_as_of);

    const diffTime = Math.abs(upToDateAsOf - latestAmended);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms → days

    res.json({
      agency: agency.name,
      titleNumber: agency.number,
      daysSinceAmendment: diffDays,
      lastAmendedOn: agency.latest_amended_on,
      upToDateAsOf: agency.up_to_date_as_of,
    });
  } catch (error) {
    console.error('Error getting historical change:', error);
    res.status(500).send('Failed to get historical change');
  }
});

// Get checksum for a specific agency (title)
app.get('/api/agency/:id/checksum', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ecfrFetcher.getStoredECFRData();

    const agency = data.titles.find((title) => title.number === parseInt(id));

    if (!agency) {
      return res.status(404).json({ error: 'Agency not found' });
    }

    const strToHash = `${agency.name}|${agency.latest_issue_date}|${agency.up_to_date_as_of}`;

    const hash = crypto.createHash('sha256').update(strToHash).digest('hex');

    res.json({
      agency: agency.name,
      titleNumber: agency.number,
      checksum: hash,
    });
  } catch (error) {
    console.error('Error generating checksum:', error);
    res.status(500).send('Failed to generate checksum');
  }
});

//amendment history for a specific agency (title)

app.get('/api/agency/:id/amendment-frequency', async (req, res) => {
  try {
    const { id } = req.params;
    const storedData = await ecfrFetcher.getStoredECFRData();
    
    const title = storedData.titles.find(t => t.number === parseInt(id));
    
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }

    const today = new Date();
    const lastAmendedDate = new Date(title.latest_amended_on);

    const daysSinceLastAmendment = Math.floor((today - lastAmendedDate) / (1000 * 60 * 60 * 24));

    res.json({
      titleNumber: id,
      daysSinceLastAmendment,
      lastAmendedOn: title.latest_amended_on,
    });

  } catch (error) {
    console.error('Error fetching amendment frequency:', error.message);
    res.status(500).send('Failed to fetch amendment frequency');
  }
});

//Get Reserved Titles

app.get('/api/agencies/reserved', async (req, res) => {
  try {
    const data = await ecfrFetcher.getStoredECFRData();
    const reservedTitles = data.titles.filter(title => title.reserved);
    res.json(reservedTitles);
  } catch (error) {
    console.error('Error fetching reserved titles:', error.message);
    res.status(500).send('Error fetching reserved titles');
  }
});




// Endpoint to retrieve stored eCFR data
app.get('/api/ecfr-data', async (req, res) => {
  try {
    const data = await ecfrFetcher.getStoredECFRData();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving eCFR data:', error);
    res.status(500).send('Failed to retrieve eCFR data.');
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
