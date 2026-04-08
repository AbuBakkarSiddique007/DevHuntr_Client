import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function GET() {
  try {
    // In a real app, you would fetch the current user's behavior and real products here.
    // For this implementation, we'll fetch real products from your API and use Gemini to recommend.
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonString = text.replace(/```json|```/g, "").trim();
    const recommendations = JSON.parse(jsonString);

    return NextResponse.json({ data: recommendations });
  } catch (err) {
    console.error("Gemini Recommendation Error:", err);
    return NextResponse.json({ data: [], error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
