const express = require('express');
const path = require('path');
const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');


const app = express();

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


// File paths
const resultsPath = path.join(__dirname, '2023results.xlsx');
const jsonOutputPath = path.join(__dirname, 'electionResults.json');

// Asynchronously read data from an Excel file and save it to a JSON file
async function readAndLogData() {
    try {
        console.log("Starting to read Excel file...");
        const rows = await readXlsxFile(resultsPath);
        if (!rows || rows.length < 11) {  // Ensure there are enough rows
            throw new Error("Not enough data in Excel file.");
        }
        const data = {
            governorCount: rows[5][15],
            viceGovernorCount: rows[6][15],
            secretaryCount: rows[7][15],
            treasurerCount: rows[8][15],
            auditorCount: rows[9][15],
            PROCount: rows[10][15]
        };
        await fs.promises.writeFile(jsonOutputPath, JSON.stringify(data, null, 2));
        console.log("Data read and written successfully.");
    } catch (error) {
        console.error("Error reading Excel file or writing JSON:", error);
    }
}

// Function to load JSON data from a file
async function loadJSON(file) {
    try {
        const data = await fs.promises.readFile(file, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading JSON data:", error);
        throw error;  // Rethrow the error to be handled by the caller
    }
}

// Read data once when the server starts
readAndLogData();

// Root route to render the main page
app.get('/', async (req, res) => {
    try {
        const jsonData = await loadJSON(jsonOutputPath);
        res.render('index', { jsonData });
    } catch (error) {
        console.error("Error at root route:", error);
        res.status(500).send("Error loading page due to server issues.");
    }
});

// API route to provide JSON data
app.get('/data', async (req, res) => {
    try {
        await readAndLogData();  // Refresh data whenever this endpoint is called
        const jsonData = await loadJSON(jsonOutputPath);
        res.json(jsonData);
    } catch (error) {
        console.error("Error at /data route:", error);
        res.status(500).send("Error retrieving data");
    }
});

// Set up the server to listen on a specified port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));