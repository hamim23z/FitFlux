import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function GET() {
  try {
    const response = await openai.responses.create({
      model: "gpt-5.2",
      input: "Say 'FitFlux AI is working!'",
    });

    return NextResponse.json({
      output: response.output_text,
    });
  } catch (error) {
    console.error("OpenAI Test Route Error:", error);
    return NextResponse.json(
      {
        error: "Failed to connect to OpenAI",
        message: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}
