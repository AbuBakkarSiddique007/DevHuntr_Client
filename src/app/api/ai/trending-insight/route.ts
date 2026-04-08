import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function GET() {
  try {
    const productsRes = await fetch("https://devhuntrserver.onrender.com/api/v1/products?limit=8");
    const productsData = await productsRes.json();
    const products = productsData.data || productsData;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ insight: "AI is currently analyzing the latest tech trends." });
    }

    const categories = products.map(p => p.category);
    
    const prompt = `
      As an AI trend analyst for DevHuntr, examine these current hot categories: ${categories.join(", ")}.
      Provide a one-sentence, punchy "AI Trend Insight" about what the developer community is focused on this week.
      Example: "AI detected a massive pivot towards open-source LLM orchestration tools this week."
      Keep it under 100 characters. No markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insight = response.text().trim();

    return NextResponse.json({ insight });
  } catch (err) {
    console.error("Gemini Trending Error:", err);
    return NextResponse.json({ insight: "Market focus is shifting towards developer productivity tools." });
  }
}
