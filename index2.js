const fs = require('fs');
const PDFParser = require('pdf-parse');

const pdfBuffer = fs.readFileSync('pdf/Std 5 Maths NCERT Chapter 9.pdf');

PDFParser(pdfBuffer).then(data => {
  console.log(data.text);
}).catch(error => {
  console.error(error);
});
