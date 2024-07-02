const fs = require('fs');
const interval = 3000; // Interval set for 3 seconds

function loadJSON(file) {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    try {
      // Parse the JSON data
      const jsonData = JSON.parse(data);
      console.log("Entire JSON File Content:");
      console.log(JSON.stringify(jsonData, null, 2)); // Properly format and log the JSON data
    } catch (parseError) {
      console.error('Error parsing JSON data:', parseError);
    }
  });
}

const filename = "electionResults.json";

// Set an interval to load the JSON file every 3 seconds
const timerId = setInterval(() => {
  loadJSON(filename);
}, interval);

// It's a good practice to clear the interval under certain conditions, e.g., upon receiving a specific signal or after a certain duration
process.on('SIGINT', () => {
  clearInterval(timerId);
  console.log('Interval cleared and process terminated.');
  process.exit();
});