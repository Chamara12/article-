import OpenAI from "openai";

// Using Grok-2 model for text generation
const MODEL = "grok-2-1212";

interface ArticleParams {
  primaryKeyword: string;
  secondaryKeywords?: string;
  wordCount: number;
  tone: string;
  pov: string;
  targetAudience?: string;
  humanize: boolean;
}

export async function generateXAIArticle(
  articlePrompt: string,
  humanizePrompt: string,
  params: ArticleParams
): Promise<string> {
  try {
    const apiKey = process.env.XAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("x.ai API key is not set");
    }
    
    const openai = new OpenAI({ 
      baseURL: "https://api.x.ai/v1",
      apiKey
    });
    
    // Fill in the template with the user's parameters
    const filledPrompt = articlePrompt
      .replace('{primaryKeyword}', params.primaryKeyword)
      .replace('{secondaryKeywords}', params.secondaryKeywords || '')
      .replace('{wordCount}', params.wordCount.toString())
      .replace('{tone}', params.tone)
      .replace('{pov}', params.pov)
      .replace('{targetAudience}', params.targetAudience || '');
    
    // Generate the article content
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are an expert SEO content writer that creates HTML content." },
        { role: "user", content: filledPrompt }
      ],
      temperature: 0.7,
    });
    
    let articleContent = completion.choices[0].message.content || "";
    
    // If humanize is enabled, run the content through another prompt
    if (params.humanize && articleContent) {
      const humanizeFilledPrompt = humanizePrompt
        .replace('{article}', articleContent)
        .replace('{tone}', params.tone)
        .replace('{pov}', params.pov);
      
      const humanizedCompletion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: "You are an expert editor that improves AI-generated content." },
          { role: "user", content: humanizeFilledPrompt }
        ],
        temperature: 0.7,
      });
      
      articleContent = humanizedCompletion.choices[0].message.content || articleContent;
    }
    
    return articleContent;
  } catch (error) {
    console.error("Error generating article with x.ai:", error);
    throw new Error(`Failed to generate article with x.ai: ${(error as Error).message}`);
  }
}
