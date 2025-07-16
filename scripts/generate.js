// generateQuestions.js
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

// Import the questions-required-fields.json
const requiredFields = require('./questions-required-fields.json');


// Define available categories
const CATEGORIES = require('./categories.json');

const generateGPTQuestions = async function () {
  if (!process.env.OPENAI_API_KEY) {
    console.error('⚠️  Please set OPENAI_API_KEY in your environment')
    process.exit(1)
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  // Adjust how many questions you want per run
  const NUM_Q = process.env.NUM_QUESTIONS || 10

  // Create type mapping for the prompt
  const questionTypeMapping = {
    'multiple-choice': 'MultipleChoice',
    'image': 'Image',
    'voice': 'Voice',
    'range': 'Range',
    'video': 'Video'
  };

  // Generate the field requirements part of the prompt
  const fieldRequirements = Object.entries(requiredFields)
    .filter(([key]) => key !== 'base')
    .map(([type, spec]) => {
      const allRequired = [
        ...(requiredFields.base.required || []),
        ...(spec.required || [])
      ];
      const allOptional = [
        ...(requiredFields.base.optional || []),
        ...(spec.optional || [])
      ];

      return `  • ${questionTypeMapping[type]}: 
    Required: ${allRequired.join(', ')}
    Optional: ${allOptional.length ? allOptional.join(', ') : 'none'}
    ${spec.validation ? 'Validation:\n' + Object.entries(spec.validation)
          .map(([field, rule]) => `      - ${field}: ${rule}`).join('\n') : ''}`
    }).join('\n');

  // Instruct GPT to emit exactly JSON, one array of objects
  // Create category guidance
  const categoryGuidance = CATEGORIES.map(cat =>
    `    - ${cat.id}: ${cat.name} (${cat.name} in Arabic context)`
  ).join('\n');

  const systemPrompt = `
You are an Arabic trivia-question generator. Every time you run, output a JSON array of ${NUM_Q} unique questions.
All questions, answers, and content MUST be in Arabic language using proper Arabic script (not transliteration).

Base Requirements (required for all questions):
${requiredFields.base.required.map(field => `  • ${field}`).join('\n')}

Categories:
  • categoryId must be one of these exact values:
${categoryGuidance}

Points System:
  • points must be one of: [100, 300, 500] representing difficulty levels:
    - 100: Easy questions (e.g., basic multiple choice)
    - 300: Medium difficulty (e.g., image recognition, voice recognition)
    - 500: Hard questions (e.g., complex video analysis, challenging ranges)

Question Type Specifications:
${fieldRequirements}

The question-type field should be one of: ${Object.keys(questionTypeMapping).join(', ')}

Remember:
- ALL text content must be in Arabic (questions, choices, answers, titles)
- Use proper Arabic numerals where appropriate
- Maintain cultural relevance to the Arab world
- Ensure questions are appropriate for the category

Do NOT include any extra fields, comments, or markdown—output pure JSON.
`.trim()

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.8,
    messages: [
      { role: 'system', content: systemPrompt },
    ],
  })

  const text = resp.choices[0].message.content
  let questions
  try {
    questions = JSON.parse(text)
  } catch (err) {
    console.error('❌ Failed to parse JSON from GPT response:')
    console.error(text)
    process.exit(1)
  }

  // Validate point values
  const validPoints = [100, 300, 500];
  const invalidQuestions = questions.filter(q => !validPoints.includes(q.points));
  if (invalidQuestions.length > 0) {
    console.error('❌ Found questions with invalid point values:');
    invalidQuestions.forEach(q => {
      console.error(`  Question "${q.title}" has invalid points: ${q.points}`);
    });
    process.exit(1);
  }

  // Validate categories
  const validCategoryIds = CATEGORIES.map(c => c.id);
  const invalidCategoryQuestions = questions.filter(q => !validCategoryIds.includes(q.categoryId));
  if (invalidCategoryQuestions.length > 0) {
    console.error('❌ Found questions with invalid category IDs:');
    invalidCategoryQuestions.forEach(q => {
      console.error(`  Question "${q.title}" has invalid categoryId: ${q.categoryId}`);
    });
    process.exit(1);
  }

  // Check for Arabic content (basic check)
  const arabicRegex = /[\u0600-\u06FF]/; // Basic Arabic script range
  const nonArabicQuestions = questions.filter(q => !arabicRegex.test(q.title));
  if (nonArabicQuestions.length > 0) {
    console.error('❌ Found questions without Arabic content:');
    nonArabicQuestions.forEach(q => {
      console.error(`  Question with id ${q.id} does not contain Arabic text`);
    });
    process.exit(1);
  }

  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const filePath = path.resolve(process.cwd(), `questions-${ts}.json`)
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2))
  console.log(`✔️  Wrote ${questions.length} questions to ${filePath}`)
}

// For CommonJS compatibility
module.exports = { generateGPTQuestions };



