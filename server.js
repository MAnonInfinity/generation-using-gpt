const { fromPath } = require('pdf2pic');
const tesseract = require("node-tesseract-ocr");
const { OpenAI } = require('openai');

const prompts = require('./prompts');
const transcripts = require('./lecture-transcripts');

const inputPDFPath = 'pdf/Std 5 Maths NCERT Chapter 9.pdf';

const openai = new OpenAI({
  apiKey: ""
});

const options = {
  density: 300,
  saveFilename: 'page',
  savePath: './images',
  format: 'png',
  width: 2000,
  height: 2000
};

async function main() {
  try {
    const pageBuffers = await fromPath(inputPDFPath, options).bulk(-1, { responseType: 'buffer' });

    if (!pageBuffers || !pageBuffers.length)
      throw new Error("Couldn't generate page buffers for the PDF");

    // const textExtractionPromises = [];

    // for (let pageBuffer of pageBuffers)
    //   if (pageBuffer && pageBuffer.buffer)
    //     textExtractionPromises.push(extractText(pageBuffer.buffer));

    // const extractedTexts = await Promise.all(textExtractionPromises);

    // extractedTexts.forEach((text, pageIndex) => {
    //   console.log(`Text from page ${pageIndex + 1}: ${text}`);
    // });

    let data = "";

    for (let pageBuffer of pageBuffers) {
      if (!pageBuffer || !pageBuffer.buffer)
        throw new Error("Couldn't generate buffer for the page");
      
      try {
        const text = await extractText(pageBuffer.buffer);
        // console.log(text);
        data += text;
      } catch (error) {
        console.error(error);
      }
    }

    console.log("Extracted Text Successfully");
    console.log(data);
    generateQuestions(data);
  } catch (error) {
    console.error(error);
  }
}

async function extractText(buffer) {
  if (!buffer)
    throw new Error("No buffer provided for OCR");

  const text = await tesseract.recognize(buffer);

  return text;
}

async function generateQuestions(text) {
  debugger;
  const prompt = prompts.generateQuestionsBasedOnTextbookContent + text;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    debugger;
    console.log("COMPLETION = ", completion);
  
    console.log(completion.choices[0].message.content);
  } catch(error) {
    console.error(error);
  }

}

main();

// generateQuestions(transcripts.additionTranscript);