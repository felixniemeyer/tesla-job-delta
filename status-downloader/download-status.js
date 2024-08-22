const fs = require('fs');
const path = require('path');

// Function to download the file
function downloadFile(dest) {
  // make request 
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    return fetch("https://www.tesla.com/cua-api/apps/careers/state", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,de;q=0.7",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"127\", \"Not)A;Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "Referer": "https://www.tesla.com/careers/search",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    }).then(response => {
      response.json().then(data => {
        // write data to file
        file.write(JSON.stringify(data), () => {
          file.end();
          resolve();
        })
      })
    }).catch((err) => {
      fs.unlink(dest, () => reject(err));
    });
  })
}

// Function to get the next ID from meta.json
function getNextId(metaFilePath) {
  if (!fs.existsSync(metaFilePath)) {
    return 1;
  }

  const lines = fs.readFileSync(metaFilePath, 'utf-8').trim().split('\n');
  const lastLine = lines[lines.length - 1];
  const lastId = parseInt(lastLine.split(',')[0], 10);

  return lastId + 1;
}

// Main function to handle the process
async function main() {
  const [ , , folderPath] = process.argv;
  
  if (!folderPath) {
    console.error('Please specify the folder path as a command-line argument.');
    process.exit(1);
  }

  const metaFilePath = path.join(folderPath, 'meta.json');
  const nextId = getNextId(metaFilePath);
  const newFileName = `${nextId}.json`;
  const newFilePath = path.join(folderPath, newFileName);
  
  try {
    await downloadFile(newFilePath);
    console.log(`Downloaded file saved as ${newFileName}`);

    const timestamp = Date.now();
    const newEntry = `${nextId},${timestamp}`;
    fs.appendFileSync(metaFilePath, `${newEntry}\n`);
    console.log('meta.json updated');
  } catch (err) {
    console.error(`Failed to download or save the file: ${err.message}`);
  }
}

main();


