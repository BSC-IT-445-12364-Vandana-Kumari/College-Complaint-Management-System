import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runChat = async (req, res) => {
  try {
    const { messages, online } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "Invalid messages format" });
    }

    const lastUserMsg = messages[messages.length - 1]?.content || "";

    // 🌐 Offline Mode Logic (Simulated smart response)
    if (online === false) {
       let offlineResponse = "I am currently in Offline Mode. I can only help with basic campus info. ";
       if (lastUserMsg.toLowerCase().includes("rule")) {
         offlineResponse += "Campus rules: 75% attendance is mandatory, and formal dress code must be followed.";
       } else if (lastUserMsg.toLowerCase().includes("notice")) {
         offlineResponse += "You can check all the latest notices in the 'Notices' section of your dashboard.";
       } else if (lastUserMsg.toLowerCase().includes("translate")) {
         offlineResponse += "Translation requires Online Mode. Please toggle 'Online' in the header.";
       } else {
         offlineResponse += "For complex problem solving or translation, please enable Online Mode.";
       }
       return res.json({ role: "assistant", content: offlineResponse });
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_openai')) {
      return res.json({ 
        role: "assistant", 
        content: "I'm sorry, my AI core is currently in maintenance mode (API Key missing). Please contact the administrator!" 
      });
    }

    // 🧠 Advanced System Prompt
    const systemPrompt = {
      role: "system",
      content: `You are the Advanced CIMAGE Institutional AI (Node Alpha-9). 
      You are designed to be as smart and helpful as ChatGPT.
      
      Capabilities:
      1. Help students with academic doubts, college rules, and technical problems.
      2. Can translate languages (Hindi to English and vice-versa).
      3. Can generate professional complaint drafts based on user issues.
      4. Always maintain a professional, high-IQ, and helpful persona.
      
      Context:
      College Name: CIMAGE (College of IT & Applied Management Education).
      Location: Patna, Bihar.
      Services: IT, Management, and Media education.
      
      If asked to translate: Provide clear, accurate translations.
      If asked to write a complaint: Draft it formally with a Subject line.
      If a problem is complex: Break down the solution step-by-step.`
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemPrompt, ...messages],
    });

    res.json(response.choices[0].message);
  } catch (error) {
    console.error("AI Assistant Error:", error.message);
    
    // 💡 Fallback for quota issues
    const fallbackResponse = "I am experiencing a high load right now. Please try again in a few minutes, or use the 'Help' section for manual guidance.";
    res.json({ role: "assistant", content: fallbackResponse });
  }
};

