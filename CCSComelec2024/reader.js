const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const path = require('path');

// Define the function to read and log data from an Excel file
async function readAndLogData() {
  try {
    // Construct the path to the Excel file
    const filePath = path.join(__dirname, "2023results.xlsx");

    // Read the Excel file
    const rows = await readXlsxFile(filePath);
    
    // Check if rows have enough data
    if (!rows || rows.length < 11) {
      throw new Error("Excel file does not contain enough data.");
    }

    // Explicitly extract data from specific cells
    let governorCount = rows[5][15];
    let viceGovernorCount = rows[6][15];
    let secretaryCount = rows[7][15];
    let treasurerCount = rows[8][15];
    let auditorCount = rows[9][15]; 
    let PROCount = rows[10][15];

    // Create a data object for the JSON output
    const data = {
      governorCount, 
      viceGovernorCount, 
      secretaryCount, 
      treasurerCount, 
      auditorCount, 
      PROCount
    };

    // Define the output JSON file path
    const outputPath = path.join(__dirname, 'electionResults.json');

    // Convert data object to JSON format
    const jsonData = JSON.stringify(data, null, 2);
    
    // Write JSON data to the file
    await fs.promises.writeFile(outputPath, jsonData);
    
    console.log("Cell values saved to JSON file successfully!");
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error during file processing:", error);
  }
}

// Export the readAndLogData function for use in other modules
module.exports = readAndLogData;

// If this script is run directly, execute the function
if (require.main === module) {
    readAndLogData().then(() => console.log("Operation completed."));
}