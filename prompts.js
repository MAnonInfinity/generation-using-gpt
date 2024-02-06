const extractQuestionsFromTextbookContent = `
  Your task is to help a teacher create quizzes for their class. 
  Each quiz should consist of multiple-choice questions with 4 options 
  and no 'all of the above' choice. 
  Extract as many question as you can that are covered in the lecture.
  Ensure questions are clear and make sense, independently of the original context.
  Generate questions of the same difficulty level as the content. 
  These questions should not be interrelated. 
  These questions should test application of content. 
  If required, you must calculate and then give the correct answer.

  I'm providing you with the content that was extracted from a textbook pdf. First the pdf was 
  converted to images and then tesseract-ocr was used to extract the text from those images,
  so you might see a bunch of random characters that don't make sense, and some mis-interpretation
  of characters/words at places, so bear with me on that please.

  Create 30 such questions.

  Here's the content:

`;

const generateQuestionsBasedOnTextbookContent = `
  Your task is to help a teacher create quizzes for their class. 
  Each quiz should consist of multiple-choice questions with 4 options 
  and no 'all of the above' choice. 
  Ensure questions are clear and make sense, independently of the original context.
  Generate questions of the same difficulty level as the content. 
  These questions should not be interrelated. 
  These are practice questions that should test application of content. 
  When and only when creating wrong choices, consider common student mistakes and provide insights into those errors. 
  If required, you must calculate and then give the correct answer.

  I'm providing you with the content that was extracted from a textbook pdf. First the pdf was 
  converted to images and then tesseract-ocr was used to extract the text from those images,
  so you might see a bunch of random characters that don't make sense, and some mis-interpretation
  of characters/words at places, so bear with me on that please.

  Create 30 such questions.

  Here's the content:

`;

const extractQuestionsFromLectureTranscript = `
  Your task is to help a teacher create quizzes for their class. 
  Each quiz should consist of multiple-choice questions with 4 options 
  and no 'all of the above' choice. 
  Extract as many question as you can that are covered in the lecture.
  Ensure questions are clear and make sense, independently of the original context.
  Generate questions of the same difficulty level as the content. 
  These questions should not be interrelated. 
  Questions should test application of content. 
  If required, you must calculate and then give the correct answer.

  I'm providing you with the transcript that was generated using WhisperAI from an audio of the lecture.
  So you might see some mis-interpretations of a few words at places, so bear with me on that please.

  Here's the transcript of the lecture:

`;

const generateQuestionsBasedOnLectureTranscript = `
  Your task is to help a teacher create quizzes for their class. 
  Each quiz should consist of multiple-choice questions with 4 options 
  and no 'all of the above' choice. 
  Ensure questions are clear and make sense, independently of the original context.
  Generate questions of the same difficulty level as the content. 
  These questions should not be interrelated. 
  These are practice questions that should test application of content. 
  When and only when creating wrong choices, consider common student mistakes and provide insights into those errors. 
  If required, you must calculate and then give the correct answer.

  I'm providing you with the transcript that was generated using WhisperAI from an audio of the lecture.
  So you might see some mis-interpretations of a few words at places, so bear with me on that please.

  Create 30 such questions.
  
  Here's the transcript of the lecture:

`;

module.exports = {
  extractQuestionsFromTextbookContent,
  generateQuestionsBasedOnTextbookContent,
  extractQuestionsFromLectureTranscript,
  generateQuestionsBasedOnLectureTranscript
}