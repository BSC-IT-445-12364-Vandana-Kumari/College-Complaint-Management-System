import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeComplaint = async (text) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return { sentiment: 'Normal', tags: ['uncharacterized'] };
    }

    const prompt = `Analyze the following college complaint and provide a JSON response with 'sentiment' (Low, Medium, High, Urgent) and 'tags' (array of string keywords like "maintenance", "academic", "harassment", etc.):
    
    Complaint: "${text}"
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.error('AI Error:', error.message);
    return { sentiment: 'Medium', tags: ['Uncategorized'] };
  }
};

