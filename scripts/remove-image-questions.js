const fs = require('fs');
const path = require('path');

// Read the questions file
const questionsFile = path.join(__dirname, '../questions-2025-07-16T00-58-47-617Z.json');
const questions = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));

// Filter out image-based questions
const filteredQuestions = questions.filter(question => question['question-type'] !== 'image');

// Write the filtered questions back to the file
fs.writeFileSync(questionsFile, JSON.stringify(filteredQuestions, null, 2));
