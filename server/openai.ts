import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeKeywords(content: string): Promise<{ 
  keywords: string[],
  suggestions: string[] 
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an SEO expert. Analyze the content and extract relevant keywords and provide optimization suggestions. Return a JSON object with 'keywords' array and 'suggestions' array."
      },
      {
        role: "user",
        content
      }
    ],
    response_format: { type: "json_object" }
  });

  const responseContent = response.choices[0].message.content;
  if (!responseContent) {
    throw new Error("Failed to get response from OpenAI");
  }

  return JSON.parse(responseContent);
}

export async function analyzeSEOScore(content: string): Promise<{
  score: number,
  suggestions: string[]
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an SEO expert. Analyze the content and provide an SEO score (0-100) and suggestions for improvement. Return a JSON object with 'score' number and 'suggestions' array."
      },
      {
        role: "user",
        content
      }
    ],
    response_format: { type: "json_object" }
  });

  const responseContent = response.choices[0].message.content;
  if (!responseContent) {
    throw new Error("Failed to get response from OpenAI");
  }

  return JSON.parse(responseContent);
}

export async function generateMetaTags(content: string): Promise<{
  title: string,
  description: string,
  keywords: string
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an SEO expert. Generate optimized meta tags for the given content. Return a JSON object with 'title', 'description', and 'keywords' strings."
      },
      {
        role: "user",
        content
      }
    ],
    response_format: { type: "json_object" }
  });

  const responseContent = response.choices[0].message.content;
  if (!responseContent) {
    throw new Error("Failed to get response from OpenAI");
  }

  return JSON.parse(responseContent);
}

export async function analyzeCompetitor(url: string): Promise<{
  metrics: {
    traffic: number;
    backlinks: number;
    keywords: number;
    domainAuthority: number;
  };
  topKeywords: string[];
  suggestions: string[];
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an SEO expert. Analyze the competitor website and provide metrics, top keywords, and suggestions. Return a JSON object with 'metrics' (including traffic, backlinks, keywords, and domainAuthority), 'topKeywords' array, and 'suggestions' array."
      },
      {
        role: "user",
        content: url
      }
    ],
    response_format: { type: "json_object" }
  });

  const responseContent = response.choices[0].message.content;
  if (!responseContent) {
    throw new Error("Failed to get response from OpenAI");
  }

  return JSON.parse(responseContent);
}