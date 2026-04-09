import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ insight: "AI is currently analyzing the latest tech trends." });
    }

    const productsRes = await fetch("https://devhuntrserver.onrender.com/api/v1/products?limit=8");
    const productsData = await productsRes.json();
    const products = productsData.data || productsData;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ insight: "AI is currently analyzing the latest tech trends." });
    }

    const categories = Array.from(new Set(products.map(p => p.category)));
    
    const prompt = `
      As an AI trend analyst for DevHuntr, examine these current hot categories: ${categories.join(", ")}.
      Provide a one-sentence, punchy "AI Trend Insight" about what the developer community is focused on this week.
      Example: "AI detected a massive pivot towards open-source LLM orchestration tools this week."
      Keep it under 100 characters. No markdown. No quotes.
    `;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3-8b-instant",
        messages: [
          { role: "system", content: "You are a concise tech trend analyst." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 50
      })
    });

    if (!groqRes.ok) throw new Error("Groq request failed");

    const groqData = await groqRes.json();
    const insight = groqData.choices[0]?.message?.content?.trim() || "Market focus is shifting towards developer productivity tools.";

    return NextResponse.json({ insight });
  } catch (err) {
    console.error("Groq Trending Error:", err);
    return NextResponse.json({ insight: "Market focus is shifting towards developer productivity tools." });
  }
}
