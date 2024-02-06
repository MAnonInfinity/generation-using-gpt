const pdfjsLib = require("pdfjs-dist/legacy/build/pdf");

async function getTextFromPDF(path) {
  let doc = await pdfjsLib.getDocument(path).promise;
  let page1 = await doc.getPage(13);
  let content = await page1.getTextContent();
  
  let strings = content.items.map(function (item) {
    return item.str;
  });
  return strings;
}

getTextFromPDF("pdf/Std 5 Maths NCERT Chapter 9.pdf")
  .then((res) => {
    console.log("TEXT =", res);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
