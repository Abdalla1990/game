const { generateGPTQuestions } = require("./generate");

function GenerateQuestionsPage() {
  return new Promise(async (resolve, reject) => {
    try {
      await generateGPTQuestions();
      setTimeout(() => {
        console.log('Questions generated');
        resolve("the script has ran, wait for the results");
      }, 2000);
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

