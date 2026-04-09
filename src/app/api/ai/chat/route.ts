import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are the "DevHuntr Guide", an expert AI assistant for DevHuntr, a platform for developers to launch and discover tech products. 
Your goal is to be helpful, professional, and developer-friendly.

CORE KNOWLEDGE:
- Launching: Create account -> Click 'Submit App' -> Fill details. Products go through moderation.
- Cost: 100% free for community members. Premium tier exists only for advanced analytics/visibility.
- Voting: Upvotes and engagement determine Trending products.
- Editing: Makers can update products anytime via the 'Creator Dashboard'.
- Product Types: We welcome dev tools, AI apps, SaaS, Chrome extensions, and technical creative projects.

GUIDELINES:
- Answer FAQ questions accurately based on the above.
- If a user wants to launch, guide them towards the submission process.
- Keep responses concise and use a bit of technical "cool" (e.g., using terms like 'maker', 'deploy', 'launch').
- Use bullet points for steps.
- DO NOT use markdown headers higher than h3.
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("[Groq API] Missing API Key");
      return NextResponse.json({ 
        message: "Key missing. Please add GROQ_API_KEY to .env.local." 
      });
    }

    // Initialize messages with the system prompt
    const messages: { role: string; content: string }[] = [
      { role: "system", content: SYSTEM_PROMPT }
    ];

    // Add conversation history
    if (history && Array.isArray(history)) {
      history.forEach((turn: { role: string; text: string }) => {
        messages.push({
          role: turn.role === "user" ? "user" : "assistant",
          content: turn.text
        });
      });
    }

    // Add current user message
    messages.push({ role: "user", content: message });

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
        stream: true
      })
    });

    if (!groqRes.ok) {
        throw new Error("Groq streaming request failed");
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqRes.body?.getReader();
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n").filter(line => line.trim() !== "");

            for (const line of lines) {
              const messageLine = line.replace(/^data: /, "");
              if (messageLine === "[DONE]") {
                controller.close();
                return;
              }

              try {
                const parsed = JSON.parse(messageLine);
                const content = parsed.choices[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // Ignore parsing errors for empty chunks intentionally
              }
            }
          }
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[Groq API Error]:", errorMessage);
    return NextResponse.json({ 
      error: "Connection failure",
      details: errorMessage
    }, { status: 500 });
  }
}
