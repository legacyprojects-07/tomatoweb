import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI instance safely
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// 2. AI Guru Assistant Chat / Doubt Solver
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, context, studentGrade, language, subject } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured.',
        fallback: true,
      });
    }

    const systemInstruction = `You are 'NEXT TOPPER AI Guru', an enthusiastic, friendly, empathetic, and exceptionally clear AI Master Teacher.
Your mission is to guide Indian & global school students to become top performers (Grade/Class: ${studentGrade || 'Class 10'}, Subject: ${subject || 'General Studies'}).

Key Rules:
1. Speak in a warm, encouraging, engaging tone with simple language, relatable real-world analogies (e.g., cricket, everyday life in India, rockets, cooking, fun facts).
2. Preferred language mode: ${language === 'hinglish' ? 'Hinglish (mix of easy English & conversational Hindi like "Bhai/Dosto, dekho yeh concept bohot simple hai...")' : 'English'}.
3. Break down complex topics into clear step-by-step bullet points with key formulas highlighted in bold or code blocks.
4. Always end with a quick interactive check question or a motivational booster tip to keep the student curious!
5. If note context is provided, reference the student's personal study notes directly to help them connect their revision with the concept!`;

    const contents = [];
    
    if (context) {
      contents.push({
        role: 'user',
        parts: [{ text: `[STUDENT NOTE CONTEXT]: ${context}\n\nPlease use this context if relevant to help answer my question.` }]
      });
      contents.push({
        role: 'model',
        parts: [{ text: `Understood! I will keep your uploaded study notes in mind while answering.` }]
      });
    }

    if (Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Chat AI Error:', err);
    res.status(500).json({ error: err.message || 'Failed to get response from NEXT TOPPER AI Guru.' });
  }
});

// 3. AI Notes Summarizer & Mindmap Generator
app.post('/api/ai/summarize-notes', async (req, res) => {
  try {
    const { noteTitle, noteContent, subject } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key missing' });
    }

    const prompt = `Analyze the following student study notes for the subject "${subject || 'General Science'}":
Title: ${noteTitle || 'Study Note'}
Content:
${noteContent}

Provide a structured educational summary in JSON format with:
1. "summary": A concise 2-3 paragraph summary explaining the core concept clearly.
2. "keyTakeaways": Array of 4-6 crucial bullet points every student must memorize for exams.
3. "keyFormulasOrTerms": Array of key terms, definitions, or formulas with brief explanations.
4. "mindMapNodes": Array of main topics and sub-items for a visual study tree.
5. "examTip": One secret exam tip or mnemonic trick to remember this topic easily.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyFormulasOrTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
              },
            },
            mindMapNodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  subtopics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
              },
            },
            examTip: { type: Type.STRING },
          },
        },
      },
    });

    const json = JSON.parse(response.text || '{}');
    res.json(json);
  } catch (err: any) {
    console.error('Summarize Error:', err);
    res.status(500).json({ error: err.message || 'Failed to summarize notes.' });
  }
});

// 4. Generate Practice Quiz from Notes or Subject
app.post('/api/ai/generate-quiz', async (req, res) => {
  try {
    const { noteContent, subject, grade, topic, count = 5 } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key missing' });
    }

    const prompt = `Generate a ${count}-question multiple-choice practice quiz for a Class ${grade || '10'} student on the subject "${subject || 'Science'}", topic: "${topic || 'General'}".
${noteContent ? `Based specifically on these student study notes:\n${noteContent}` : ''}

Make questions educational, engaging, with single correct option and clear explanations for why the answer is correct.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.NUMBER },
                  explanation: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const quizData = JSON.parse(response.text || '{}');
    res.json(quizData);
  } catch (err: any) {
    console.error('Quiz Generation Error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate practice quiz.' });
  }
});

// 5. Generate Flashcards from Notes
app.post('/api/ai/generate-flashcards', async (req, res) => {
  try {
    const { noteContent, subject } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key missing' });
    }

    const prompt = `Create 6 revision flashcards from these study notes for Subject: ${subject || 'General'}:
Notes Content:
${noteContent}

Return front (question/prompt) and back (concise clear answer) for effective active recall memory training.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            deckTitle: { type: Type.STRING },
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  hint: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.error('Flashcard Error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate flashcards.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BYJU'S Learning Hub Server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
