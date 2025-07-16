// generateQuestions.js
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const { generateImage } = require('./imageProcessing');
const { generateAudio } = require('./audioProcessing');

// Import the questions-required-fields.json
const requiredFields = require('./questions-required-fields.json');

// Define available categories
const CATEGORIES = require('./categories.json');

// Cost tracking constants
const DALL_E_COST = 0.04; // $0.04 per image
const AUDIO_COST = 0.015; // $0.015 per 1k characters

// Cost tracking variables
let totalImageCost = 0;
let totalImagesFailed = 0;
let totalImagesGenerated = 0;
let totalAudioGenerated = 0;
let totalAudioFailed = 0;
let totalAudioCost = 0;

/**
 * Process media content for a question (image or audio)
 * @param {Object} config - Configuration for media processing
 * @returns {Promise<Object>} Processed question with media data
 */
async function processMediaContent(question, config) {
  const {
    type,
    generator,
    statsTracking,
    mediaConfig
  } = config;

  try {
    console.log(`\nProcessing ${type} for question: ${question.title}`);
    const mediaData = await generator(question);

    // Update statistics
    statsTracking.generated++;
    statsTracking.cost += mediaConfig.cost;

    return {
      ...question,
      ...mediaData
    };
  } catch (error) {
    console.error(`✗ Failed to generate ${type}:`, error.message);
    statsTracking.failed++;
    return {
      ...question,
      [`${type}-type`]: 'placeholder',
      [`${type}-data`]: question[mediaConfig.fallbackField]
    };
  }
}

async function processQuestion(question) {
  // Handle question-specific processing
  if (question['question-type'] === 'image') {
    return processMediaContent(question, {
      type: 'image',
      generator: generateImage,
      statsTracking: {
        generated: totalImagesGenerated,
        failed: totalImagesFailed,
        cost: totalImageCost
      },
      mediaConfig: {
        cost: DALL_E_COST,
        fallbackField: 'image-hint'
      }
    });
  }

  if (question['question-type'] === 'voice') {
    return processMediaContent(question, {
      type: 'audio',
      generator: generateAudio,
      statsTracking: {
        generated: totalAudioGenerated,
        failed: totalAudioFailed,
        cost: totalAudioCost
      },
      mediaConfig: {
        cost: AUDIO_COST,
        fallbackField: 'audio-url'
      }
    });
  }

  // For multiple choice, ensure correct-answer-index
  if (question['question-type'] === 'multiple-choice') {
    const { 'correct-answer': _, ...rest } = question;
    return rest;
  }

  // For other types (video), ensure they use correct-answer
  return question;
}

const generateGPTQuestions = async function () {
  if (!process.env.OPENAI_API_KEY) {
    console.error('⚠️  Please set OPENAI_API_KEY in your environment')
    process.exit(1)
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  // Adjust how many questions you want per run
  const NUM_Q = Number(process.env.NUM_QUESTIONS) || 10

  // Create type mapping for the prompt
  const questionTypeMapping = {
    'multiple-choice': 'MultipleChoice',
    'image': 'Image',
    'voice': 'Voice',
    'range': 'Range',
    'video': 'Video'
  };

  // Example questions for each type to guide the model
  const questionTypeExamples = {
    'multiple-choice': 'Question: "ما هي عاصمة المملكة العربية السعودية؟" with choices ["الرياض", "جدة", "مكة", "المدينة"]',
    'image': 'Question: "تعرف على هذا المعلم التاريخي" with image-hint "معلم تاريخي شهير في مصر القديمة يعكس العمارة الفرعونية" and correct-answer "الأهرامات"',
    'voice': 'Question: "استمع واكتب اسم هذا المقام الموسيقي" with audio-url "example.com/maqam.mp3" and correct-answer "مقام البيات"',
    'range': 'Question: "كم يبلغ ارتفاع برج خليفة؟" with min-value: 700, max-value: 900, correct-answer: 828, range: 10, unit: "متر"',
    'video': 'Question: "حدد اسم هذه المعركة التاريخية" with video-url "example.com/battle.mp4"'
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
    Example: ${questionTypeExamples[type]}
    ${spec.validation ? 'Validation:\n' + Object.entries(spec.validation)
          .map(([field, rule]) => `      - ${field}: ${rule}`).join('\n') : ''}`
    }).join('\n');

  // Create category guidance
  const categoryGuidance = CATEGORIES.map(cat =>
    `    - ${cat.id}: ${cat.name} (${cat.name} in Arabic context)`
  ).join('\n');

  const systemPrompt = `
You are an Arabic trivia-question generator. Every time you run, output a JSON array of ${NUM_Q} UNIQUE questions.
So when running this the next times dont produce the same questions.
All questions, answers, and content MUST be in Arabic language using proper Arabic script (not transliteration).

STRICT DISTRIBUTION REQUIREMENTS (CRITICAL):
• For ${NUM_Q} questions, you MUST distribute them as follows:
  - multiple-choice: ${Math.floor(NUM_Q / 5)} questions
  - image: ${Math.floor(NUM_Q / 5)} questions
  - voice: ${Math.floor(NUM_Q / 5)} questions
  - range: ${Math.floor(NUM_Q / 5)} questions
  - video: ${Math.floor(NUM_Q / 5)} questions
  - Remaining ${NUM_Q % 5} question(s) can be of any type
• This distribution is MANDATORY - DO NOT DEVIATE
• EVERY question type MUST have at least one question
• Multiple-choice questions MUST NOT exceed ${Math.floor(NUM_Q / 5) + 1}

MEDIA CONTENT REQUIREMENTS:
• Image Questions Examples:
  - تعرف على هذا المعلم التاريخي (معالم وآثار)
  - حدد نوع هذا النبات (نباتات وأشجار)
  - تعرف على هذا الخط العربي (أنواع الخطوط)
  - اكتشف هذا النمط المعماري (عمارة إسلامية)
  
• Voice Questions Examples:
  - تعرف على هذا المقام الموسيقي (مقامات عربية)
  - حدد نوع هذا الطائر من صوته (أصوات الطيور)
  - من هو هذا القارئ المشهور (تلاوات قرآنية)
  - تعرف على هذه اللهجة العربية (لهجات)
  
• Video Questions Examples:
  - حدد اسم هذه المعركة التاريخية (معارك)
  - تعرف على هذه الرقصة التراثية (فنون شعبية)
  - حدد نوع هذه الظاهرة الطبيعية (ظواهر)
  - اكتشف هذا الفن الحركي (فنون)

TARGET AUDIENCE:
• Questions are for native Arabic speakers with full language proficiency
• Language-related questions should be appropriately challenging:
  - Grammar questions should cover nuanced rules and exceptions
  - Vocabulary questions should include classical Arabic (فصحى) terms
  - Literary questions should reference sophisticated texts and poetry
  - Linguistic questions should cover etymology and morphology
  - Basic language questions (simple grammar, common words) should be avoided
  - Focus on rich aspects of Arabic language like:
    * Complex derivatives (اشتقاقات)
    * Subtle differences between similar words (فروق لغوية)
    * Classical poetry meters (بحور الشعر)
    * Rhetorical devices (بلاغة)
    * Root system complexities (جذور وأوزان)

CRITICAL OUTPUT REQUIREMENTS:
1. Return ONLY a complete, valid JSON array.
2. Each question object MUST have ALL required fields properly filled.
3. NEVER leave any field empty or incomplete.
4. ALL string values MUST use double quotes (").
5. DO NOT use string concatenation or template literals.
6. DO NOT include any text before or after the JSON.

COMPLETION REQUIREMENTS:
• EVERY question MUST have ALL its required fields
• For multiple-choice: MUST have 4 complete choices and a valid correct-answer-index
• For image/voice: MUST have complete URLs and correct-answer
• For range: MUST have all numeric fields (min, max, correct, range)
• NEVER leave arrays with empty strings ["value", "", ""]
• NEVER include empty objects or partial data
• If you cannot complete a question fully, do not include it

CALENDAR REQUIREMENTS FOR HISTORY QUESTIONS:
• For Islamic history questions:
  - ALL dates MUST be in Hijri calendar (التقويم الهجري)
  - Examples: تاريخ معركة بدر، تاريخ فتح مكة، تأسيس الدولة الأموية
  - Format dates as: سنة ### هجرية
  - Include both the event and its Hijri year
  - For range questions about Islamic dates, use Hijri years

• For non-Islamic history questions:
  - ALL dates MUST be in Gregorian calendar (التقويم الميلادي)
  - Examples: اكتشاف أمريكا، الحرب العالمية، تأسيس جامعة الدول العربية
  - Format dates as: سنة ### ميلادية
  - Include both the event and its Gregorian year
  - For range questions about non-Islamic dates, use Gregorian years

• Calendar Context Requirements:
  - Question text MUST clearly indicate which calendar is being used
  - Use appropriate Arabic terms: هجري/هجرية for Hijri, ميلادي/ميلادية for Gregorian
  - For multiple choice questions with dates, all options must use the same calendar system
  - Range questions must specify which calendar system to use in the question text

Example of CORRECT multiple-choice question:
{
  "id": "q1",
  "categoryId": "cat1",
  "points": 300,
  "title": "السؤال هنا",
  "question-type": "multiple-choice",
  "choices": ["الخيار ١", "الخيار ٢", "الخيار ٣", "الخيار ٤"],
  "correct-answer-index": 0
}

Example of correct response format:
[
  {
    "id": "q1",
    "categoryId": "cat1",
    "points": 100,
    "title": "سؤال",
    "question-type": "multiple-choice",
    "choices": ["اختيار ١", "اختيار ٢"],
    "correct-answer-index": 0
  }
]

Base Requirements (required for all questions):
${requiredFields.base.required.map(field => `  • ${field}`).join('\n')}

Categories:
  • categoryId must be one of these exact values:
${categoryGuidance}
  • categoryId must match one of the available categories
  • the questions produced must be equally distributed across the categories

Category Distribution Requirements:
  • CRITICAL: Questions MUST be evenly distributed across ALL available categories
  • For ${NUM_Q} questions across ${CATEGORIES.length} categories:
    - Each category should have approximately ${Math.floor(NUM_Q / CATEGORIES.length)} questions
    - Maximum deviation: ±1 question per category
    - No category should be left empty
    - No category should have more than ${Math.ceil(NUM_Q / CATEGORIES.length) + 1} questions
  • Category Distribution Validation:
    - Track the count of questions per category
    - Ensure all categories are represented
    - Balance difficulty levels within each category
    - Distribute question types evenly within each category

Question Types Distribution:
  CRITICAL REQUIREMENTS FOR QUESTION TYPE DISTRIBUTION:
  • For ${NUM_Q} questions, you MUST distribute them as follows:
    ${Object.keys(questionTypeMapping).map(type =>
    `- ${type}: ${Math.floor(NUM_Q / Object.keys(questionTypeMapping).length)} questions`
  ).join('\n    ')}
  • Maximum allowed deviation: ±1 question per type
  • Multiple-choice questions MUST NOT exceed ${Math.ceil(NUM_Q / Object.keys(questionTypeMapping).length) + 1} questions
  • Every question type MUST be used at least once
  • For media questions (image, voice, video):
    - Use placeholder URLs in format "https://placeholder.com/[type]/[description]"
    - Example: "https://placeholder.com/image/pyramids-of-giza.jpg"
    - Always provide detailed description in the URL for later replacement

Media Content Guidelines:
  • Image Questions:
    - Historical landmarks and architecture
    - Famous artifacts and archaeological finds
    - Scientific diagrams and charts
    - Cultural symbols and traditional items
  
  • Voice Questions:
    - Traditional music and maqams
    - Quranic recitations
    - Famous speeches
    - Nature and animal sounds
  
  • Video Questions:
    - Historical events reenactments
    - Traditional dances
    - Scientific phenomena
    - Sports highlights

Points System:
  • points must be one of: [100, 300, 500] representing strictly defined difficulty levels:

    100 points (Easy):
    - Basic knowledge and simple recall questions
    - Common cultural facts known to most Arabic speakers
    - Simple multiple choice with clear, distinct options
    - Common but non-trivial language concepts (e.g., less common plural forms, معاني الحروف)
    - Well-known historical events
    - Examples: capital cities, basic religious facts, popular sports figures, تصريف الأفعال المشهورة

    300 points (Medium):
    - Questions requiring analysis or recognition
    - Moderate cultural or historical knowledge
    - Image or voice recognition of notable items/people
    - Mathematical concepts requiring calculation
    - Language questions involving complex grammar (إعراب الجمل المركبة, أحكام النحو)
    - Advanced vocabulary and morphology (اشتقاقات, أوزان غير شائعة)
    - Sports questions about specific tournaments or records
    - Examples: identifying architectural styles, scientific concepts, literary works, تحليل النصوص الأدبية

    500 points (Hard):
    - Complex analysis or deep subject knowledge required
    - Specific historical details or dates
    - Advanced scientific or mathematical concepts
    - Sophisticated language concepts:
      * Complex rhetorical analysis (تحليل بلاغي متقدم)
      * Classical poetry meters (بحور الشعر)
      * Rare linguistic phenomena (ظواهر لغوية نادرة)
      * Advanced etymology (أصول الكلمات وتطورها)
      * Classical Arabic texts analysis (تحليل نصوص التراث)
    - Detailed cultural or religious scholarship
    - Video analysis of complex events
    - Range questions requiring precise knowledge
    - Examples: تحليل قصائد الجاهلية, إعراب آيات متشابهة, مقارنة المذاهب النحوية

  • Each difficulty level must match its question type appropriately
  • Multiple choice questions can appear at any difficulty level, but hard ones must have sophisticated distractors
  • Media questions (image, voice, video) should focus on recognition at 300 points, analysis at 500 points

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
    model: 'gpt-4',
    temperature: 0.3, // Lower temperature for more consistent output
    frequency_penalty: 0.2, // Slight penalty to avoid repetition
    presence_penalty: 0.1, // Light penalty to encourage diverse questions
    max_tokens: 4000, // Ensure enough tokens for complete output
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: 'Generate the questions according to the specifications. Return only the JSON array.'
      }
    ],
    tools: [
      {
        type: "function",
        function: {
          name: 'generate_questions',
          description: 'Generate Arabic trivia questions with precise difficulty levels',
          parameters: {
            type: 'object',
            required: ['questions'],
            properties: {
              questions: {
                type: 'array',
                description: 'Array of trivia questions in Arabic',
                minItems: NUM_Q,
                maxItems: NUM_Q,
                items: {
                  type: 'object',
                  required: ['id', 'categoryId', 'points', 'title', 'question-type'],
                  properties: {
                    id: {
                      type: 'string',
                      description: 'Unique identifier for the question'
                    },
                    categoryId: {
                      type: 'string',
                      enum: CATEGORIES.map(c => c.id),
                      description: 'Category ID from the predefined list'
                    },
                    points: {
                      type: 'integer',
                      enum: [100, 300, 500],
                      description: '100: Basic recall questions only. 300: Analysis or recognition required. 500: Complex analysis or deep knowledge required.'
                    },
                    title: {
                      type: 'string',
                      description: 'The question text in Arabic'
                    },
                    'question-type': {
                      type: 'string',
                      enum: Object.keys(questionTypeMapping),
                      description: 'The type of question'
                    },
                    choices: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'For multiple-choice questions, the array of possible answers in Arabic'
                    },
                    'correct-answer-index': {
                      type: 'integer',
                      description: 'For multiple-choice questions, the index of the correct answer'
                    },
                    'image-hint': {
                      type: 'string',
                      description: 'For image questions, the URL or description of the image'
                    },
                    'correct-answer': {
                      type: 'string',
                      description: 'For image/voice questions, the correct answer in Arabic'
                    },
                    'audio-url': {
                      type: 'string',
                      description: 'For voice questions, the URL of the audio file'
                    },
                    transcript: {
                      type: 'string',
                      description: 'For voice questions, optional transcript of the audio'
                    },
                    'video-url': {
                      type: 'string',
                      description: 'For video questions, the URL of the video file'
                    },
                    'min-value': {
                      type: 'number',
                      description: 'For range questions, the minimum acceptable value'
                    },
                    'max-value': {
                      type: 'number',
                      description: 'For range questions, the maximum acceptable value'
                    },
                    'range': {
                      type: 'number',
                      description: 'For range questions, number, must be declared as the acceptable range around the correct value considering min-value and max-value'
                    },
                    'correct-answer': {
                      type: 'number',
                      description: 'For range questions, the exact correct answer. Use this instead of correct-answer for range questions.'
                    },
                    'image-type': {
                      type: 'string',
                      enum: ['base64', 'placeholder'],
                      description: 'For image questions, specifies the type of image data'
                    },
                    unit: {
                      type: 'string',
                      description: 'For range questions, optional unit of measurement'
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]
  })

  // Calculate token usage and cost
  const { prompt_tokens, completion_tokens, total_tokens } = resp.usage;
  // GPT-4 pricing: $0.03 per 1K prompt tokens, $0.06 per 1K completion tokens
  const promptCost = (prompt_tokens / 1000) * 0.03;
  const completionCost = (completion_tokens / 1000) * 0.06;
  const totalCost = promptCost + completionCost;

  console.log('\nToken Usage Report:');
  console.log('------------------');
  console.log(`Prompt tokens: ${prompt_tokens}`);
  console.log(`Completion tokens: ${completion_tokens}`);
  console.log(`Total tokens: ${total_tokens}`);
  console.log('\nCost Breakdown:');
  console.log('------------------');
  console.log(`Prompt cost: $${promptCost.toFixed(4)}`);
  console.log(`Completion cost: $${completionCost.toFixed(4)}`);
  console.log(`Total cost: $${totalCost.toFixed(4)}`);
  console.log('------------------\n'); let questions;
  try {
    const message = resp.choices[0].message;
    let jsonContent = '';

    // Parse questions from tool calls or direct content
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      if (toolCall.function && toolCall.function.arguments) {
        const args = JSON.parse(toolCall.function.arguments);
        questions = args.questions;
      }
    } else if (message.content) {
      // Handle string template format
      if (message.content.includes("'[\\n' +")) {
        // Extract the actual JSON by joining the lines and evaluating the string template
        jsonContent = message.content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line)
          .join('')
          .replace(/\\n/g, '\n')
          .replace(/'\s*\+\s*'/g, '')
          .replace(/^'|'$/g, '');
      } else {
        jsonContent = message.content;
      }

      try {
        questions = JSON.parse(jsonContent);
      } catch (parseError) {
        // If parsing fails, try to clean up the JSON string further
        jsonContent = jsonContent
          .replace(/,(\s*[\]}])/g, '$1') // Remove trailing commas
          .replace(/,\s*,/g, ',') // Remove empty entries
          .replace(/{\s*},/g, '') // Remove empty objects
          .replace(/,\s*}/g, '}') // Remove trailing commas in objects
          .replace(/"\s*,\s*"/g, '","') // Fix string arrays
          .replace(/\[\s*,/g, '[') // Clean array starts
          .replace(/,\s*\]/g, ']') // Clean array ends
          .replace(/"\s*:\s*"/g, '":"') // Clean key-value pairs
          .replace(/{\s*"?\s*"?\s*}/g, '{}') // Clean empty objects
          .replace(/\[\s*\]/g, '[]') // Clean empty arrays
          .replace(/,+/g, ',') // Remove multiple commas
          .replace(/,\s*$/, ''); // Remove trailing comma

        questions = JSON.parse(jsonContent);
      }
    }

    if (!questions || !Array.isArray(questions)) {
      throw new Error('No valid questions array in response');
    }

    // Process all questions for proper formatting
    console.log('\nProcessing questions...');
    console.log('---------------------');

    const processedQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      console.log(`Processing question ${i + 1}/${questions.length}...`);
      const processedQuestion = await processQuestion(questions[i]);
      processedQuestions.push(processedQuestion);
    }

    questions = processedQuestions;

    // Filter out empty or invalid questions
    questions = questions.filter(q =>
      q && typeof q === 'object' &&
      q.id &&
      q.categoryId &&
      q.title &&
      q['question-type'] &&
      // For image questions, require either a successful image generation or an image-hint
      (q['question-type'] !== 'image' || (q.image || q['image-hint']))
    );

    // Convert points to numbers
    questions = questions.map(q => ({
      ...q,
      points: Number(q.points)
    }));

    console.log(`Successfully parsed ${questions.length} questions`);
  } catch (err) {
    console.error('❌ Failed to parse questions from GPT response:');
    console.error('Error:', err.message);
    console.error('Raw response:', resp.choices[0].message);
    process.exit(1);
  }

  // Convert points to numbers and validate point values
  const validPoints = [100, 300, 500];
  console.log('\nValidation Summary:');
  console.log('------------------');

  // Convert points to numbers in all questions and filter invalid ones
  questions.forEach(q => {
    q.points = Number(q.points);
  });

  const invalidPointQuestions = questions.filter(q => !validPoints.includes(q.points));
  if (invalidPointQuestions.length > 0) {
    console.log('⚠️  Filtering questions with invalid point values:');
    invalidPointQuestions.forEach(q => {
      console.log(`  Question "${q.title}" has invalid points: ${q.points} (${typeof q.points})`);
    });
  }

  // Filter out questions with invalid points
  questions = questions.filter(q => validPoints.includes(q.points));

  // Validate categories
  const validCategoryIds = CATEGORIES.map(c => c.id);
  const invalidCategoryQuestions = questions.filter(q => !validCategoryIds.includes(q.categoryId));
  if (invalidCategoryQuestions.length > 0) {
    console.log('⚠️  Filtering questions with invalid category IDs:');
    invalidCategoryQuestions.forEach(q => {
      console.log(`  Question "${q.title}" has invalid categoryId: ${q.categoryId}`);
    });
  }

  // Filter out questions with invalid categories
  questions = questions.filter(q => validCategoryIds.includes(q.categoryId));

  // Check for Arabic content (basic check)
  const arabicRegex = /[\u0600-\u06FF]/; // Basic Arabic script range
  const nonArabicQuestions = questions.filter(q => !arabicRegex.test(q.title));
  if (nonArabicQuestions.length > 0) {
    console.log('⚠️  Filtering questions without Arabic content:');
    nonArabicQuestions.forEach(q => {
      console.log(`  Question with id ${q.id} does not contain Arabic text`);
    });
  }

  // Filter out non-Arabic questions
  questions = questions.filter(q => arabicRegex.test(q.title));

  // Print summary of filtered questions
  const totalFiltered = invalidPointQuestions.length + invalidCategoryQuestions.length + nonArabicQuestions.length;
  if (totalFiltered > 0) {
    console.log('\nFiltering Summary:');
    console.log(`  Points validation: ${invalidPointQuestions.length} questions removed`);
    console.log(`  Category validation: ${invalidCategoryQuestions.length} questions removed`);
    console.log(`  Arabic content validation: ${nonArabicQuestions.length} questions removed`);
    console.log(`  Total questions remaining: ${questions.length}`);
    console.log('------------------\n');
  }

  // Check question type distribution
  const questionTypes = Object.keys(questionTypeMapping);
  const typeCount = {};
  questions.forEach(q => {
    typeCount[q['question-type']] = (typeCount[q['question-type']] || 0) + 1;
  });

  // Calculate expected count per type
  const expectedCountPerType = Math.floor(questions.length / questionTypes.length);
  const maxDeviation = 1;

  console.log('\nQuestion Type Distribution Analysis:');
  console.log('----------------------------------');
  let distributionErrors = [];
  let hasMultipleChoiceExcess = false;
  let hasMissingTypes = false;

  questionTypes.forEach(type => {
    const count = typeCount[type] || 0;
    const deviation = Math.abs(count - expectedCountPerType);
    const distribution = (count / questions.length * 100).toFixed(1);

    console.log(`${type}:`);
    console.log(`  Count: ${count} questions`);
    console.log(`  Expected: ${expectedCountPerType} ±${maxDeviation}`);
    console.log(`  Distribution: ${distribution}%`);
    console.log(`  Deviation: ${deviation}\n`);

    if (count === 0) {
      hasMissingTypes = true;
      distributionErrors.push(`${type} has no questions (minimum 1 required)`);
    } else if (deviation > maxDeviation) {
      distributionErrors.push(
        `${type} has ${count} questions (expected ${expectedCountPerType}±${maxDeviation})`
      );
    }

    if (type === 'multiple-choice' && count > expectedCountPerType + maxDeviation) {
      hasMultipleChoiceExcess = true;
    }
  });

  if (distributionErrors.length > 0 || hasMissingTypes || hasMultipleChoiceExcess) {
    console.error('\n❌ Question type distribution issues detected:');
    if (hasMissingTypes) {
      console.error('  Some question types are missing (should have at least one of each type)');
    }
    if (hasMultipleChoiceExcess) {
      console.error('  Too many multiple-choice questions');
    }
    distributionErrors.forEach(err => console.error(`  ${err}`));
    console.error('\nExpected distribution:');
    console.error(`  ${expectedCountPerType}±${maxDeviation} questions per type`);
    console.error('Note: Questions will still be saved, but please review distribution for future runs.\n');
  }

  // Check category distribution
  const categoryCount = {};
  questions.forEach(q => {
    categoryCount[q.categoryId] = (categoryCount[q.categoryId] || 0) + 1;
  });

  // Calculate expected count per category
  const expectedCountPerCategory = Math.floor(questions.length / CATEGORIES.length);
  const maxCategoryDeviation = 1;

  console.log('\nCategory Distribution Analysis:');
  console.log('--------------------------------');
  let categoryDistributionErrors = [];
  CATEGORIES.forEach(cat => {
    const count = categoryCount[cat.id] || 0;
    const deviation = Math.abs(count - expectedCountPerCategory);
    const distribution = (count / questions.length * 100).toFixed(1);

    console.log(`${cat.name} (${cat.id}):`);
    console.log(`  Count: ${count} questions`);
    console.log(`  Expected: ${expectedCountPerCategory} ±${maxCategoryDeviation}`);
    console.log(`  Distribution: ${distribution}%`);
    console.log(`  Deviation: ${deviation}\n`);

    if (count === 0) {
      categoryDistributionErrors.push(`${cat.name} has no questions (minimum 1 required)`);
    } else if (deviation > maxCategoryDeviation) {
      categoryDistributionErrors.push(
        `${cat.name} has ${count} questions (expected ${expectedCountPerCategory}±${maxCategoryDeviation})`
      );
    }
  });

  if (categoryDistributionErrors.length > 0) {
    console.error('\n❌ Category distribution issues detected:');
    categoryDistributionErrors.forEach(err => console.error(`  ${err}`));
    console.error('\nExpected distribution:');
    console.error(`  ${expectedCountPerCategory}±${maxCategoryDeviation} questions per category`);
    console.error('Note: Questions will still be saved, but please review distribution for future runs.\n');
  }

  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const filePath = path.resolve(process.cwd(), `questions-${ts}.json`)
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2))
  console.log(`✔️  Wrote ${questions.length} questions to ${filePath}`)
}


module.exports = {
  generateGPTQuestions
};



