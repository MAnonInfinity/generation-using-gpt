const transcripts = require('./lecture-transcripts');
const { fromPath } = require('pdf2pic');
const tesseract = require("node-tesseract-ocr");
const { OpenAI } = require('openai');

const prompts = require('./prompts');

const options = {
  density: 300,
  saveFilename: 'page',
  savePath: './images',
  format: 'png',
  width: 2000,
  height: 2000
};

const openai = new OpenAI({
  apiKey: ''
});

async function main(pdfUrl = 'pdf/Std 5 Maths NCERT Chapter 9.pdf', pages = null) {
  const inputPDFPath = pdfUrl;

  try {
    const pageBuffers = await fromPath(inputPDFPath, options).bulk([1, 3, 5, 9, 11], { responseType: 'buffer' });

    if (!pageBuffers || !pageBuffers.length)
      throw new Error("Couldn't generate page buffers for the PDF");

    let data = "";

    for (let pageBuffer of pageBuffers) {
      if (!pageBuffer || !pageBuffer.buffer)
        throw new Error("Couldn't generate buffer for the page");

      try {
        const text = await extractText(pageBuffer.buffer);
        data += text;
      } catch (error) {
        console.error(error);
      }
    }

    console.log(data);
    console.log("Extracted Text Successfully");
    return { qna: await generateQuestions(false, data) };
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

async function generateQuestions(isFromTranscript, text = null) {
  let prompt;

  if (isFromTranscript)
    prompt = prompts.extractQuestionsFromLectureTranscript + transcripts.additionTranscript;
  else
    prompt = prompts.extractQuestionsFromTextbookContent + text;

  const schema = {
    'type': 'object',
    'properties': {
      'qna': {
        'type': 'array',
        'items': {
          'type': 'object',
          'properties': {
            'questionNumber': {
              'type': 'number',
            },
            'question': {
              'type': 'string',
            },
            'A': {
              'type': 'string',
            },
            'B': {
              'type': 'string',
            },
            'C': {
              'type': 'string',
            },
            'D': {
              'type': 'string',
            },
            'correctAnswer': {
              'type': 'string',
              'description': 'The correct option, in upper case, that is the answer'
            }
          },
          'required': ['questionNumber', 'question', 'A', 'B', 'C', 'D', 'correctAnswer']
        }
      }
    }
  };

  // const schema = {
  //   'type': 'object',
  //   'properties': {
  //     'qna': {
  //       'type': 'array',
  //       'items': {
  //         'type': 'object',
  //         'properties': {
  //           'questionNumber': {
  //             'type': 'number',
  //           },
  //           'question': {
  //             'type': 'string',
  //           },
  //           'A': {
  //             'type': 'object',
  //             'properties': {
  //               'option': {
  //                 'type': 'string',
  //               },
  //               'generalMistake': {
  //                 'type': 'string',
  //                 'description': 'This key does not exist if this option is the correct answer i.e only exists for wrong answers. Prediction of the general mistake (and the thought process) the person could be making when they chose this option as the correct answer'
  //               }
  //             },
  //             'required': ['option']
  //           },
  //           'B': {
  //             'type': 'object',
  //             'properties': {
  //               'option': {
  //                 'type': 'string',
  //               },
  //               'generalMistake': {
  //                 'type': 'string',
  //                 'description': 'This key does not exist if this option is the correct answer i.e only exists for wrong answers. Prediction of the general mistake (and the thought process) the person could be making when they chose this option as the correct answer'
  //               }
  //             },
  //             'required': ['option']
  //           },
  //           'C': {
  //             'type': 'object',
  //             'properties': {
  //               'option': {
  //                 'type': 'string',
  //               },
  //               'generalMistake': {
  //                 'type': 'string',
  //                 'description': 'This key does not exist if this option is the correct answer i.e only exists for wrong answers. Prediction of the general mistake (and the thought process) the person could be making when they chose this option as the correct answer'
  //               }
  //             },
  //             'required': ['option']
  //           },
  //           'D': {
  //             'type': 'object',
  //             'properties': {
  //               'option': {
  //                 'type': 'string',
  //               },
  //               'generalMistake': {
  //                 'type': 'string',
  //                 'description': 'This key does not exist if this option is the correct answer i.e only exists for wrong answers. Prediction of the general mistake (and the thought process) the person could be making when they chose this option as the correct answer'
  //               }
  //             },
  //             'required': ['option']
  //           },
  //           'correctAnswer': {
  //             'type': 'string',
  //             'description': 'The correct option, in upper case, that is the answer'
  //           }
  //         },
  //         'required': ['questionNumber', 'question', 'A', 'B', 'C', 'D', 'correctAnswer']
  //       }
  //     }
  //   }
  // };

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a creator of highly effective diagnostic quizzes.' },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-3.5-turbo',
      functions: [{ name: 'generate_qna', parameters: schema }],
      function_call: { name: 'generate_qna' }
    });
    console.log('COMPLETION = ', JSON.stringify(completion, null, 2));

    console.log(completion.choices[0].message.function_call.arguments);
    return completion.choices[0].message.function_call.arguments;

    // console.log(completion.choices[0].message.content);
    // return completion.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
}

main();
// generateQuestions(true);