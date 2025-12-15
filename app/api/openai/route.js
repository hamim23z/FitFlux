import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function GET() {
  try {
    const response = await openai.responses.create({
      model: "gpt-5-mini", // you can also try "gpt-4.1-mini"
      input: "Say 'FitFlux AI is working!'",
    });

    return NextResponse.json({
      output: response.output_text,
    });
  } catch (error) {
    console.error("AI Test Error:", error);

    return NextResponse.json(
      {
        error: "Failed to connect to OpenAI",
        message: String(error?.message || error),
        type: error?.name,
      },
      { status: 500 }
    );
  }
}
