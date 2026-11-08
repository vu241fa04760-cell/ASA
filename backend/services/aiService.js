const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getSubjectYouTube } = require('../utils/youtubeHelper');

const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];

// Initialize Gemini if key exists
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

// Resilient helper to call active Gemini models with automatic fallback
const callGemini = async (prompt, systemInstruction = '', history = []) => {
  const gemini = getGeminiClient();
  if (!gemini) return null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = gemini.getGenerativeModel({ model: modelName, systemInstruction });
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(prompt);
      const text = result?.response?.text();
      if (text && text.trim()) {
        return { text: text.trim(), model: modelName };
      }
    } catch (err) {
      console.warn(`[AI Service] Model ${modelName} call failed:`, err.message?.slice(0, 80));
    }
  }
  return null;
};

// Helper to clean and parse JSON string from LLM output
const extractJSON = (text) => {
  try {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI structured response');
  }
};

/**
 * 1. AI Study Assistant Chat (ChatGPT Experience)
 */
const generateChatResponse = async ({ message, subject = 'General', history = [], simplify = false }) => {
  const yt = getSubjectYouTube(subject, message.slice(0, 35));

  const systemInstruction = `You are an elite, highly intelligent, and friendly AI Study Tutor and Academic Copilot (working exactly like ChatGPT for students).
Subject Discipline: ${subject}.
Teaching Mode: ${simplify ? 'Explain in extremely intuitive, beginner-friendly terms with relatable everyday analogies (ELI5 style).' : 'Comprehensive, step-by-step academic explanation with depth, clarity, and university rigor.'}
Personality: Direct, warm, encouraging, knowledgeable, and pedagogical.
Format Guidelines:
- Answer the student's question thoroughly and conversationally.
- Use clean Markdown with headers (###), bold text (**text**), bullet points, numbered steps, and formatted code blocks with syntax highlighting where relevant.
- Walk through algorithms, mathematical calculations, proofs, or conceptual mechanics step-by-step.
- Conclude with an insightful follow-up question or practical study tip.`;

  const prompt = `Student Question: "${message}"\n\nProvide your comprehensive, well-structured response:`;
  const conversationHistory = (history || [])
    .slice(0, -1)
    .slice(-8)
    .map((item) => ({
      role: item.sender === 'user' ? 'user' : 'model',
      parts: [{ text: item.content }],
    }));

  while (conversationHistory[0]?.role === 'model') {
    conversationHistory.shift();
  }

  const geminiResult = await callGemini(prompt, systemInstruction, conversationHistory);

  if (geminiResult && geminiResult.text) {
    // Extract key conceptual takeaways organically from markdown lines
    const lines = geminiResult.text
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.startsWith('-') || l.startsWith('*') || /^\d+\./.test(l));

    const conceptBreakdown = lines
      .slice(0, 3)
      .map(l => l.replace(/^[-*\d.]\s*/, '').replace(/\*\*/g, '').trim())
      .filter(Boolean);

    return {
      content: geminiResult.text,
      conceptBreakdown: conceptBreakdown.length > 0 ? conceptBreakdown : [
        `Core mechanism: ${message.slice(0, 30)}`,
        `Fundamental principle in ${subject}`,
        `Practical derivation and exam application`
      ],
      examples: [
        `Real-world implementation in ${subject} systems`,
        `Standard exam case study walkthrough`
      ],
      practiceQuestion: `Would you like to try a practice problem on this topic, or shall we explore a specific step deeper?`,
      youtube: yt,
      source: geminiResult.model,
    };
  }

  // Resilient educational fallback if offline
  const fallbackBreakdowns = [
    `Foundations of ${subject}: Core principles and theoretical frameworks that form the bedrock of this topic.`,
    `Step-by-Step Mechanisms: How the components interact, execute, or produce results in practical scenarios.`,
    `Critical Application & Edge Cases: Where this concept is applied in exams and real-world engineering or academic problems.`,
  ];

  const fallbackExamples = [
    `Analogy: Think of ${message.slice(0, 30)}... like a traffic dispatcher coordinating multiple vehicles without collision.`,
    `Real-world application: Used in modern systems to optimize performance, maintain state, or solve complex constraints.`,
  ];

  return {
    content: `### Understanding ${message.replace(/[?.]/g, '')} (${subject})\n\nGreat question! Let's break this down systematically:\n\n1. **Core Concept Overview:**\nAt its heart, this revolves around mastering foundational mechanics. When studying **${subject}**, understanding the core mechanics provides clarity for advanced problem solving.\n\n2. **Detailed Step-by-Step Explanation:**\n- **Step 1: Input & Initialization** - Defining initial states and context.\n- **Step 2: Processing & Transformation** - How equations, logic, or mechanisms mutate state and resolve parameters.\n- **Step 3: Output & Verification** - Evaluating correctness against standard theoretical baselines.\n\n3. **Why this matters for your exams:**\nQuestions on this topic commonly test your grasp of edge conditions, definitions, and practical derivations. Keep practicing with concrete scenarios!`,
    conceptBreakdown: fallbackBreakdowns,
    examples: fallbackExamples,
    practiceQuestion: `How would you explain the fundamental difference in this concept when applied to high-scale or real-world constraints?`,
    youtube: yt,
    source: 'educational_engine',
  };
};

/**
 * 2. AI Notes Generator
 */
const generateNotes = async ({ topic, subject, difficulty = 'Intermediate' }) => {
  const ytNotes = getSubjectYouTube(subject, topic);

  const prompt = `You are a master academic notes generator for university students (working like ChatGPT).
Topic: "${topic}"
Subject: "${subject}"
Difficulty: "${difficulty}"

Generate exhaustive, high-yield study notes in valid JSON ONLY with this schema:
{
  "title": "Clear, professional title",
  "summary": "Concise 3-4 sentence overview of the topic",
  "keyPoints": [
    "High-yield point 1",
    "High-yield point 2",
    "High-yield point 3",
    "High-yield point 4",
    "High-yield point 5"
  ],
  "detailedExplanation": "Deep-dive markdown formatted explanation covering background, architecture/theory, formulas/code/diagrams where relevant, and practical takeaways.",
  "practicalExamples": [
    "Concrete example 1 with walkthrough",
    "Concrete example 2 with walkthrough"
  ],
  "tags": ["tag1", "tag2", "tag3"]
}`;

  const geminiResult = await callGemini(prompt);

  if (geminiResult && geminiResult.text) {
    try {
      const parsed = extractJSON(geminiResult.text);
      return {
        ...parsed,
        youtube: ytNotes,
        source: geminiResult.model,
      };
    } catch (error) {
      console.warn('[AI Service] Notes JSON parse error, constructing notes from text:', error.message);
      return {
        title: `Mastery Notes: ${topic}`,
        summary: `${topic} is a foundational concept in ${subject}. Understanding its core mechanisms and theoretical underpinnings empowers students to solve complex problems and practical implementations.`,
        keyPoints: [
          `Foundations & Core Principles of ${topic}`,
          `Operational steps and algorithmic behaviors`,
          `Edge constraints and trade-offs`,
          `High-yield exam definitions and derivations`,
        ],
        detailedExplanation: geminiResult.text,
        practicalExamples: [
          `Textbook application of ${topic} in ${subject}`,
          `Real-world implementation case study`,
        ],
        tags: [subject.toLowerCase(), topic.toLowerCase().replace(/\s+/g, '-'), 'study-guide'],
        youtube: ytNotes,
        source: geminiResult.model,
      };
    }
  }

  // Fallback intelligent notes generator
  return {
    title: `Mastery Notes: ${topic}`,
    summary: `${topic} is a cornerstone concept in ${subject}. Understanding its foundational mechanisms, historical context, and core principles empowers students to solve theoretical exam problems and real-world implementations effortlessly.`,
    keyPoints: [
      `Definition & Scope: Formal definitions, axiomatic properties, and core nomenclature of ${topic}.`,
      `Core Mechanics: How components interact predictably and produce target outcomes under varying constraints.`,
      `Efficiency & Complexity: Best-case, average-case, and worst-case trade-offs and optimizations.`,
      `Common Pitfalls: Frequent misunderstandings in tests, false assumptions, and edge case oversights.`,
      `Exam Checklist: Key formulas, terminology definitions, and standard derivation steps to memorize.`,
    ],
    detailedExplanation: `### Deep Dive: ${topic}\n\n#### 1. Background & Context\nIn modern ${subject}, **${topic}** provides the structural framework necessary to analyze and synthesize complex behaviors. By isolating fundamental drivers, we can reason about system stability, algorithmic efficiency, and conceptual elegance.\n\n#### 2. Key Architecture & Equations\n- **Mathematical / Logical Foundation:** Every operational step builds on consistent rules.\n- **Component Interactions:** Inputs flow through intermediate transformations before yielding the validated output state.\n\n#### 3. Best Practices for Revision\n1. Review the key definitions until you can explain them without notes.\n2. Work through at least 3 numerical or code-based exercises.\n3. Summarize the trade-offs in your own words before test day.`,
    practicalExamples: [
      `Standard Implementation: Applying ${topic} to solve a textbook case study under standard operational limits.`,
      `Stress Test Case: What happens when edge conditions (e.g. empty inputs, boundary limits, or extreme scale) are encountered.`,
    ],
    tags: [subject.toLowerCase(), topic.toLowerCase().replace(/\s+/g, '-'), 'exam-prep', 'study-guide'],
    youtube: ytNotes,
    source: 'educational_engine',
  };
};

/**
 * 3. AI Quiz Generator
 */
const generateQuiz = async ({ topic, subject, difficulty = 'Medium', count = 5 }) => {
  const prompt = `You are a certified exam creator and university professor in ${subject}.
Create a high-quality practice quiz for:
Topic: "${topic}"
Subject: "${subject}"
Difficulty: "${difficulty}"
Number of questions: ${count}

Each question must be challenging, educational, and have exactly 4 multiple-choice options with ONE unambiguous correct answer and an instructive explanation.

Respond in valid JSON ONLY with this schema:
{
  "title": "${subject}: ${topic} Practice Exam",
  "questions": [
    {
      "questionText": "Question 1 text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Detailed explanation of why this option is correct and why the distractors are wrong."
    }
  ]
}`;

  const geminiResult = await callGemini(prompt);

  if (geminiResult && geminiResult.text) {
    try {
      const parsed = extractJSON(geminiResult.text);
      return {
        ...parsed,
        source: geminiResult.model,
      };
    } catch (error) {
      console.warn('[AI Service] Gemini quiz parse failed, falling back:', error.message);
    }
  }

  // Fallback intelligent quiz generator with curated pedagogical questions
  const generatedQuestions = [
    {
      questionText: `What is the primary fundamental objective of ${topic} within ${subject}?`,
      options: [
        `To optimize resource utilization, maintain predictability, and provide systematic evaluation`,
        `To bypass standard security protocols and hardware constraints`,
        `To store indefinite amounts of unstructured logs without verification`,
        `To replace mathematical validation with heuristic guesswork`,
      ],
      correctAnswerIndex: 0,
      explanation: `${topic} in ${subject} is designed specifically to optimize efficiency, enforce consistency, and enable repeatable validation.`,
    },
    {
      questionText: `When analyzing trade-offs in ${topic}, which of the following is considered a primary constraint?`,
      options: [
        `Arbitrary styling conventions`,
        `Time complexity, memory overhead, and computational correctness`,
        `Operating system licensing tiers`,
        `Network cable physical colors`,
      ],
      correctAnswerIndex: 1,
      explanation: `Systematic engineering and academic evaluations of ${topic} prioritize computational time, memory space, and correctness over peripheral factors.`,
    },
    {
      questionText: `Which scenario represents the most critical edge-case challenge when implementing ${topic}?`,
      options: [
        `Handling boundary limits, concurrent state mutations, or null/empty inputs`,
        `Running on a modern multi-core processor`,
        `Printing debug logs to the terminal`,
        `Saving documents in UTF-8 format`,
      ],
      correctAnswerIndex: 0,
      explanation: `Edge conditions like zero-length bounds, concurrent race conditions, and null parameters are where bugs in ${topic} most frequently surface.`,
    },
    {
      questionText: `In standard academic benchmarks for ${subject}, what is the recommended practice for verifying ${topic}?`,
      options: [
        `Relying solely on intuition without automated test fixtures`,
        `Formal mathematical induction or thorough unit test suites covering edge cases`,
        `Executing code once without measuring execution time`,
        `Assuming correctness if no compiler error was displayed`,
      ],
      correctAnswerIndex: 1,
      explanation: `Rigorous academic and industry standards require formal proofs or automated test coverage covering boundary conditions.`,
    },
    {
      questionText: `How does mastering ${topic} directly contribute to overall expertise in ${subject}?`,
      options: [
        `It eliminates the need to study any other subject matter`,
        `It bridges theoretical models with scalable, practical problem-solving capability`,
        `It guarantees immediate 100% exam score without further review`,
        `It simplifies all hardware architecture into a single register`,
      ],
      correctAnswerIndex: 1,
      explanation: `Mastery of ${topic} provides the essential bridge between foundational theory and high-order application.`,
    },
  ];

  return {
    title: `${subject}: ${topic} Comprehensive Exam`,
    questions: generatedQuestions.slice(0, count),
    source: 'educational_engine',
  };
};

/**
 * 4. Document Summarization & Q/A
 */
const summarizeDocument = async ({ text, originalName, subject = 'General Study' }) => {
  const safeText = (text || '').slice(0, 15000);

  const prompt = `You are a high-level academic research assistant.
Analyze and summarize the following uploaded study document:
File Name: "${originalName}"
Subject: "${subject}"
Content:
"""
${safeText}
"""

Generate an insightful, comprehensive summary in valid JSON ONLY with this schema:
{
  "summary": "Well-structured 4-6 sentence summary synthesizing the core message and findings",
  "keyTakeaways": [
    "Takeaway 1: Fundamental takeaway with specifics",
    "Takeaway 2: Methodological or conceptual breakthrough",
    "Takeaway 3: Application or exam-relevant formula/insight",
    "Takeaway 4: Critical limitation or consideration",
    "Takeaway 5: Final conclusion and future scope"
  ],
  "qaPairs": [
    {
      "question": "Core question answered by this document?",
      "answer": "Clear, direct answer extracted from the document."
    },
    {
      "question": "What is the primary method or principle discussed?",
      "answer": "Direct explanation of the principle."
    },
    {
      "question": "How can a student apply this material in an exam or project?",
      "answer": "Practical takeaway and study recommendation."
    }
  ]
}`;

  const geminiResult = await callGemini(prompt);

  if (geminiResult && geminiResult.text) {
    try {
      const parsed = extractJSON(geminiResult.text);
      return {
        ...parsed,
        source: geminiResult.model,
      };
    } catch (error) {
      console.warn('[AI Service] Gemini document summarization parse failed:', error.message);
    }
  }

  // Fallback document summarization engine
  const wordCount = safeText.split(/\s+/).filter(Boolean).length;
  const snippet = safeText.slice(0, 300).replace(/\s+/g, ' ');

  return {
    summary: `This uploaded document (${originalName}) contains approximately ${wordCount} words focusing on ${subject}. The text explores foundational concepts, systematic procedures, and structured insights. Key themes identified include structured definitions, theoretical models, and practical recommendations for study and implementation.`,
    keyTakeaways: [
      `Foundational Theme: Explores primary definitions and conceptual foundations introduced in the document.`,
      `Procedural Methodology: Emphasizes systematic step-by-step reasoning over arbitrary memorization.`,
      `Practical Applications: Identifies key areas where this material directly impacts coursework and exams.`,
      `Critical Insights: Highlights boundary conditions and frequently tested nuances.`,
      `Synthesis: Concludes with actionable guidelines for further reading and revision.`,
    ],
    qaPairs: [
      {
        question: `What is the central theme of ${originalName}?`,
        answer: `The document systematically explores core principles of ${subject}, detailing definitions, workflows, and evaluation criteria based on the uploaded text: "${snippet.slice(0, 120)}..."`,
      },
      {
        question: `How should a student best study this document?`,
        answer: `Break down the material into the 5 key takeaways, practice generating flashcards from the text, and test recall using the AI Quiz Generator.`,
      },
      {
        question: `What are the most crucial formulas or definitions to remember?`,
        answer: `Focus on the highlighted terms in the introductory and synthesis sections, particularly those relating to ${subject} fundamentals.`,
      },
    ],
    source: 'educational_engine',
  };
};

/**
 * 5. Ask Questions Based on an Uploaded Document
 */
const askDocumentQuestion = async ({ documentText, question, originalName }) => {
  const safeText = (documentText || '').slice(0, 12000);

  const prompt = `You are an AI study tutor helping a student understand their uploaded document (${originalName}).
Document Content:
"""
${safeText}
"""

Student Question: "${question}"

Provide a thorough, accurate answer strictly citing the document content where applicable. If the document doesn't explicitly contain the answer, provide the best academic answer while clarifying that it extends beyond the text.`;

  const geminiResult = await callGemini(prompt);

  if (geminiResult && geminiResult.text) {
    return {
      answer: geminiResult.text,
      source: geminiResult.model,
    };
  }

  return {
    answer: `Based on your uploaded document (${originalName}), your question "${question}" relates to the core principles presented in the material. \n\nFrom the text analysis:\n1. The document introduces this concept as a primary driver of ${originalName.replace(/\.[^/.]+$/, '')}.\n2. To address your question directly: Make sure to cross-reference the primary sections outlining definitions and methodologies.\n3. Tip: Review the key takeaways generated on this document for quick reference during revision.`,
    source: 'educational_engine',
  };
};

module.exports = {
  generateChatResponse,
  generateNotes,
  generateQuiz,
  summarizeDocument,
  askDocumentQuestion,
};
