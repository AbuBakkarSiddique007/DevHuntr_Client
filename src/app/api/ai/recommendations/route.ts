import { NextResponse } from "next/server";

const CANDIDATE_MODELS = [
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b"
];

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ data: [] });
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";
    const productsRes = await fetch(`${API_BASE}/products?limit=10`);
    const productsData = await productsRes.json();
    const products = productsData.data || productsData;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const productsContext = products.map((p: { id: string; name: string; description: string; category: string }) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category
    }));

    const prompt = `
      You are an AI personalization engine for DevHuntr. Given the following list of tech products:
      ${JSON.stringify(productsContext)}

      Recommend the top 3 most interesting products for a generic developer interested in "productivity, AI, and developer tools".
      Return ONLY a JSON array of objects with the following structure:
      [
        { "title": "Product Name", "description": "Why this is recommended", "category": "Category Name" }
      ]
    `;

    let groqRes: Response | null = null;
    let lastError = "";

    for (const model of CANDIDATE_MODELS) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: "You are a specialized JSON recommendation engine." },
            { role: "user", content: prompt }
          ],
          temperature: 0.1,
          response_format: { type: "json_object" }
        })
      });

      if (res.ok) {
        groqRes = res;
        break;
      }

      const errText = await res.text();
      lastError = `Model ${model} failed (${res.status}): ${errText}`;
      console.warn(`[Groq Recommendation warning]: ${lastError}`);
    }

    if (!groqRes) throw new Error(lastError || "Groq request failed");

    const groqData = await groqRes.json();
    const content = groqData.choices[0]?.message?.content || "{}";
    
    // Parse the JSON object
    const parsed = JSON.parse(content);
    
    // Flexible extraction: handle top-level array or wrapped objects
    let recommendations: unknown[] = [];
    if (Array.isArray(parsed)) {
      recommendations = parsed;
    } else if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
      recommendations = parsed.recommendations;
    } else if (parsed.data && Array.isArray(parsed.data)) {
      recommendations = parsed.data;
    } else if (parsed.products && Array.isArray(parsed.products)) {
      recommendations = parsed.products;
    }

    return NextResponse.json({ data: recommendations.slice(0, 3) });
  } catch (err) {
    console.error("Groq Recommendation Error:", err);
    return NextResponse.json({ data: [], error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
