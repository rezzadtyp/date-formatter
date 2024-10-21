const fs = require("fs");
const readline = require("readline");

// Function to convert date to MMDDYYYY format
function formatDate(dateString) {
  let date;
  // Try various date formats to account for different input formats
  if (dateString.includes("/")) {
    date = new Date(dateString);
  } else if (dateString.includes("-")) {
    const parts = dateString.split(/[-/]/);
    if (parts[0].length === 4) {
      // If year is first (YYYY-MM-DD or YYYY/MM/DD)
      date = new Date(parts[0], parts[1] - 1, parts[2]);
    } else if (parts[2].length === 4) {
      // If day is first (DD-MM-YYYY or DD/MM/YYYY)
      date = new Date(parts[2], parts[1] - 1, parts[0]);
    }
  }

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }

  const month = ("0" + (date.getMonth() + 1)).slice(-2); // MM
  const day = ("0" + date.getDate()).slice(-2); // DD
  const year = date.getFullYear(); // YYYY

  return `${month}${day}${year}`;
}

// Function to process the input file and write the output file
async function processDates(inputFile, outputFile) {
  const fileStream = fs.createReadStream(inputFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const output = fs.createWriteStream(outputFile);

  for await (const line of rl) {
    try {
      const formattedDate = formatDate(line.trim());
      output.write(formattedDate + "\n");
    } catch (error) {
      console.error(error.message);
    }
  }

  output.end();
  console.log(`Formatted dates saved to ${outputFile}`);
}

// Run the script
const inputFile = "input.txt";
const outputFile = "output.txt";

processDates(inputFile, outputFile);
