const { fromPath } = require('pdf2pic');
const tesseract = require("node-tesseract-ocr");

const inputPDFPath = 'pdf/addition-subtraction-practice.pdf';

const options = {
  density: 300,
  saveFilename: 'page',
  savePath: './outputImages',
  format: 'png',
  width: 2000,
  height: 2000
};
const pageToConvert = 1;

async function main () {
  const convert = fromPath(inputPDFPath, options);

  convert(pageToConvert, { responseType: 'image' })
  .then((resolve) => {
    console.log("Converted to image successfully");

    extractText();
  })
  .catch((error) => {
    console.error(error);
  });
}

async function extractText() {
  const text = await tesseract.recognize(`./outputImages/page.${pageToConvert}.png`);
  // const text = await tesseract.recognize(`./images/one.png`);

  console.log(text);
}

main();

// extractText();