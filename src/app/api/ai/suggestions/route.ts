import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ data: [] });
  }

  try {
    const prompt = `
      As a tech product discovery assistant for DevHuntr, suggest 3-5 relevant product search ideas or categories based on the query: "${query}".
      Return ONLY a JSON array of objects with the following structure:
      [
        { "title": "Product Title or Idea", "description": "Brief catchphrase", "category": "Category Name" }
      ]
      Focus on developer tools, SaaS, productivity apps, and innovative tech.
      Example: if query is "chat", suggest "AI Chatbots", "Real-time Messaging SDKs", etc.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Robust JSON extraction: look for the first [ and last ]
    const startBracket = text.indexOf("[");
    const endBracket = text.lastIndexOf("]");
    
    if (startBracket === -1 || endBracket === -1) {
      throw new Error("Invalid AI response: No JSON array found");
    }

    const jsonString = text.substring(startBracket, endBracket + 1);
    const suggestions = JSON.parse(jsonString);

    return NextResponse.json({ data: suggestions });
  } catch (err) {
    console.error("Gemini Suggestion Error:", err);
    return NextResponse.json({ data: [], error: "Failed to generate valid suggestions" }, { status: 500 });
  }
}
