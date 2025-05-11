import Anthropic from '@anthropic-ai/sdk';
import { mongoStorage } from "../routes";

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const MODEL = "claude-3-7-sonnet-20250219";

interface ArticleParams {
  primaryKeyword: string;
  secondaryKeywords?: string;
  wordCount: number;
  tone: string;
  pov: string;
  targetAudience?: string;
  humanize: boolean;
}

export async function generateAnthropicArticle(
  articlePrompt: string,
  humanizePrompt: string,
  params: ArticleParams
): Promise<string> {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      throw new Error("Anthropic API key is not set");
    }
    
    const anthropic = new Anthropic({
      apiKey,
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
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: "You are an expert SEO content writer that creates HTML content.",
      messages: [
        { role: 'user', content: filledPrompt }
      ]
    });
    
    let articleContent = '';
    if (response.content[0].type === 'text') {
      articleContent = response.content[0].text;
    }
    
    // Track API usage (estimate tokens - more accurate would be to use Claude's usage tracking)
    const inputTokensEstimate = filledPrompt.length / 4; // rough estimate
    const outputTokensEstimate = articleContent.length / 4; // rough estimate
    const tokensUsed = Math.ceil(inputTokensEstimate + outputTokensEstimate);
    
    // Track the API usage
    await mongoStorage.trackApiUsage('claude', tokensUsed);
    
    // If humanize is enabled, run the content through another prompt
    if (params.humanize && articleContent) {
      const humanizeFilledPrompt = humanizePrompt
        .replace('{article}', articleContent)
        .replace('{tone}', params.tone)
        .replace('{pov}', params.pov);
      
      const humanizedResponse = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 4000,
        system: "You are an expert editor that improves AI-generated content.",
        messages: [
          { role: 'user', content: humanizeFilledPrompt }
        ]
      });
      
      articleContent = humanizedResponse.content[0].text;
      
      // Track API usage for the humanize step
      const humanizeInputTokensEstimate = humanizeFilledPrompt.length / 4;
      const humanizeOutputTokensEstimate = articleContent.length / 4;
      const humanizeTokensUsed = Math.ceil(humanizeInputTokensEstimate + humanizeOutputTokensEstimate);
      
      // Track the API usage
      await mongoStorage.trackApiUsage('claude', humanizeTokensUsed);
    }
    
    return articleContent;
  } catch (error) {
    console.error("Error generating article with Anthropic Claude:", error);
    throw new Error(`Failed to generate article with Claude: ${(error as Error).message}`);
  }
}
