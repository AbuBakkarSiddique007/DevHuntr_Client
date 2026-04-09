import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ data: [] });
    }

    const productsRes = await fetch("https://devhuntrserver.onrender.com/api/v1/products?limit=10");
    const productsData = await productsRes.json();
    const products = productsData.data || productsData;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const productsContext = products.map(p => ({
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

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3-8b-instant",
        messages: [
          { role: "system", content: "You are a specialized JSON recommendation engine." },
          { role: "user", content: prompt }
        ],
        temperature: 0.1, // Low temperature for consistent JSON
        response_format: { type: "json_object" }
      })
    });

    if (!groqRes.ok) throw new Error("Groq request failed");

    const groqData = await groqRes.json();
    const content = groqData.choices[0]?.message?.content || "[]";
    
    // Groq returns the full object, extract the array
    const parsed = JSON.parse(content);
    const recommendations = Array.isArray(parsed) ? parsed : (parsed.recommendations || parsed.data || []);

    return NextResponse.json({ data: recommendations });
  } catch (err) {
    console.error("Groq Recommendation Error:", err);
    return NextResponse.json({ data: [], error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
