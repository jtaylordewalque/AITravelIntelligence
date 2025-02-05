import OpenAI from "openai";
import { z } from "zod";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI();

const travelSuggestionSchema = z.object({
  destination: z.string(),
  duration: z.string(),
  budget: z.string(),
  activities: z.array(z.string()),
  transportation: z.array(z.string()),
  accommodation: z.string(),
});

export type TravelSuggestion = z.infer<typeof travelSuggestionSchema>;

export async function getTravelSuggestions(prompt: string): Promise<TravelSuggestion> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert travel agent. Based on the user's description, provide travel suggestions in a structured format. Focus on practical, specific recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content received from OpenAI');
    }

    return travelSuggestionSchema.parse(JSON.parse(content));
  } catch (error) {
    console.error('Error getting travel suggestions:', error);
    throw error;
  }
}