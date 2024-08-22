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
        "cookie": "optimizelyEndUserId=oeu1714922691739r0.6611113825264803; oxpOriUrl=https%3A%2F%2Fwww.tesla.com%2Fteslaaccount; _abck=E182DC764BDA8BA2CA213C1611FF265E~0~YAAQX4UVAlLxkF6PAQAAuLbGZwtzIObps1oz++Ns9nAXFNlC0bOFT0Ca6nUgo42cGVzn7FrTwYdFwfcLnu+RzwSr2JSS1JGMxQNWFRGD1sqAfV7O8TZMdrp3yRZf0wL673eNuu4e0KjkFV3LxijEihjFcomMadsAJsvW09P9A33Uf5rIRLuSKHwnky+6t07mxZ4m2gojy4dNnj/vlFywQf0WwHbi7kRDHpTriyHw9OBB/xBL5EJ+/zU9oogH9EaJZWJ8jWozrHPUMG+h05VSyEZ9XsTMCZMPhBFXKAu4mqKAwPLcIcTBI42nI9e8SPy0/+ZWfXMJ9GMGR8tr6sWH2qOMYU+0rvL6xSZ7IyxLey6338M9IebRwjjpBJ0fa4LilH6lj8FRAc46XfSAJnxva4C+4eOUSg==~-1~-1~1715436627; _pk_id.1.3c49=422fcfd66f8068a6.1721146057.; _gcl_au=1.1.2089037037.1723070787; _ga_KFP8T9JWYJ=GS1.1.1723070787.1.0.1723070787.60.0.0; _ga=GA1.1.849195725.1723070787; _pk_ref.1.3c49=%5B%22%22%2C%22%22%2C1723961109%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; tsla-cookie-consent=accepted; bm_mi=C45B1EA81BB8364CAD452D1CBB54C2A6~YAAQX4UVAr+n4XCRAQAASxuPehih7GiJ3oCVVqHkNbzUB+ZvUvCviG7I/AaJHE1mYRyuL1iSEKPAeIBfEFFt9zwf6827Nforr0f3MjWfnRMD3GRFrhLPAg7fUJ6dMtOIMWOlSF46RZU1T22SPdnZnQv1cheMsaIsXO0zOUjRaZ7p/0hEzP2hV2jLzhFNsDa/goQdpv9DOxjf5i6gx5AozcIAinB9XOZ23HlE2yzuqaCQ898lkq72jLByVNYMbbdRqsOFNoH0YLZbOd3JzYsUTWvY+jhSCAnw4WhG4JdBZP7MJAIVxjbTuPyq2PApMAT/5P4LSsARiIU5zuwmYa8qwB6uqL/rxUWjXQ==~1; bm_sv=68B7ECE741EE4DC63D9466D84FB34029~YAAQX4UVApGp4XCRAQAAFEWPehiXOsu3m3EznWckEOyrsNLFVSsBSTwgueovaNrUpP/FXdaDymfhH4jqiUoO5RC7CEzLe7fGLKWpaGxhx5nXwo40FLQEirHzjG9OuEK4eOZkvFevGkQu1T+zYwZ35+ml/5XAsLQLck+tLnyuB/XZR4/TR0W4C2sPlRJoOZAqlYC1XUNKUx2jXD/YOw82Wc5jDCPWZ4NselnIMe7TAKIGVXBPrrFZz1rtdxWW1yY=~1; ak_bmsc=A4826121894DFACE5AF67C79B1EFFC0A~000000000000000000000000000000~YAAQX4UVAoiz4XCRAQAAPeWPehg5JKpWig6rEoJvAQ7/p4jV15Pky8RHOv5ddGhQdFOZLVqx6LJr7X4jsI3fkiBMQsHvcwMK9A3cPh8sYjDwtjqg0wpPNLxmfeyJIdsJzzOluAX6li2r/PpSoZoDaSFavTwBWMhnj82W627huhcMkreY2PILHr8hS67Mv7okriWjIesUUUaQQ7kPORKIWIvXyS7OkpC7OUoGDhaEIdQR4hFp5aPjoHxC4Ur1UQsdaH+KgX1sIB5vSUF4zFSxp5b4vO80sAJ/2JBAqx6+oqQQW449SPj08J6j+IrrrwX9UcuUkBikkU0jEROMG/DTAoxVBbcGjVsIHrb5Ipg1XS7ClLhUwl3jY4gXX2UqVWT3tDfzosHidf4Q8y8wqjg2NCHJZsWeTIFiVPFU7n17LZETk7GFRZjABkiLs6WzX7G5/WpWqPdGO7wIQ9uuaT3NuyaLX+y+e/ZWPr1uCLJCyvB0SMk=; cua_sess=d60bb7fd3d5215518dfb069860dcf901",
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


