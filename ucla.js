const fs = require('fs');
const puppeteer = require('puppeteer');

function extractItems() {. // extract data from each subject
  const acronyms = document.querySelectorAll('.cell.c1');
  // const titles = document.querySelectorAll('.courseTitle');
  const items = [];
  for (var i = 0; i < acronyms.length; i++){
    let acronym = `${acronyms[i].childNode[0].childNode[0].innerText}`
    items.push(acronym);
  }
  return items;
}

function getSubjects() {  // get selectors for each class
  var subjects = []
  for (var i = 1; i < 70; j++){
    for (var j = 1; j < 3; i++){
      subjects.push(`#browsebymain > div.browsebylist > ul:nth-child(${j}) > li:nth-child(${i}) > a`)
    }
  }
  return subjects;
}


async function scrapeMultiplePages(
  page,
  extractItems,
  scrollDelay = 1000,
) {
  var items = [];
  
try {
    var i = 0;
    while (i < 1) {

      	try {

      		await page.goto('https://ccle.ucla.edu/blocks/ucla_browseby/view.php?term=18F&type=subjarea');
          var subjects = await page.evaluate(getSubjects);
          for (var s in subjects){
            await page.click(s)
            item = await page.evaluate(extractItems);
            items = items.concat(item)
          }
          
          await page.waitFor(scrollDelay);

      	} catch(e) {
      		break;
      	}

      i++
      await page.waitFor(scrollDelay);
    }
  } catch(e) { }
  return items;
}

(async () => {
  // Set up browser and page.
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  // Navigate to the demo page.
  await page.goto('https://ccle.ucla.edu/blocks/ucla_browseby/view.php?term=18F&type=subjarea');

  // Scroll and extract items from the page.
  const items = await scrapeMultiplePages(page, extractItems);

  // Save extracted items to a file.
  // fs.writeFileSync('./courses_ucla_2.txt', items.join('\n') + '\n');
  console.log(items)
  // Close the browser.
  await browser.close();
})();