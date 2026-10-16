import { NextResponse } from "next/server";

const CANDIDATE_MODELS = [
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b"
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ data: [] });
  }

  const groqKey = process.env.GROQ_API_KEY;

  if (groqKey) {
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

      let groqRes: Response | null = null;
      for (const model of CANDIDATE_MODELS) {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: "You are a specialized JSON recommendation assistant." },
              { role: "user", content: prompt }
            ],
            temperature: 0.2,
            response_format: { type: "json_object" }
          })
        });

        if (res.ok) {
          groqRes = res;
          break;
        }
      }

      if (groqRes) {
        const data = await groqRes.json();
        const content = data.choices[0]?.message?.content || "[]";
        const parsed = JSON.parse(content);
        const list = Array.isArray(parsed) 
          ? parsed 
          : parsed.suggestions || parsed.data || parsed.results || [];
        return NextResponse.json({ data: list });
      }
    } catch (err) {
      console.warn("Groq suggestions error:", err);
    }
  }

  return NextResponse.json({ data: [] });
}
