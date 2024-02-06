const tesseract = require("node-tesseract-ocr");
const fs = require("fs/promises");

async function extractText() {
  const img = await fs.readFile("images/4.png")
  const text = await tesseract.recognize(img)

  console.log("Result:", text)
}

extractText();