const { generateGPTQuestions } = require("./question-generation");

function GenerateQuestionsPage() {
  return new Promise(async (resolve, reject) => {
    try {
      await generateGPTQuestions();
      resolve("Questions generated successfully!");
    } catch (error) {
      console.error('Error generating questions:', error);
      reject(error);
    }
  });
}

if (typeof window === 'undefined') {
  // Node.js environment
  GenerateQuestionsPage().then((message) => {
    console.log(message);
    process.exit(0);
  }).catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

