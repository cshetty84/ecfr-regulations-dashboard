// backend/ecfrFetcher.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');


const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'ecfrData.json');

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

async function fetchAndStoreECFRData() {
  try {
    const url = 'https://www.ecfr.gov/api/versioner/v1/titles';
    const response = await axios.get(url, { responseType: 'text' });

    fs.writeFileSync(DATA_FILE, JSON.stringify(response.data, null, 2));
    console.log('eCFR data fetched and stored.');
  } catch (error) {
    console.error('Error fetching or storing eCFR data:', error);
    throw error;
  }
}

async function getStoredECFRData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      throw new Error('Data file does not exist. Please fetch the data first.');
    }
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
      
    let data = JSON.parse(rawData);
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    return data;
  } catch (error) {
    console.error('Error reading stored eCFR data:', error);
    throw error;
  }
}

module.exports = {
  fetchAndStoreECFRData,
  getStoredECFRData,
};
