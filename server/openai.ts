import OpenAI from "openai";
import { z } from "zod";

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

const dreamDestinationSchema = z.object({
  destination: z.string(),
  description: z.string(),
  activities: z.array(z.string()),
  bestTimeToVisit: z.string(),
  estimatedBudget: z.string(),
  highlights: z.array(z.string()),
  climate: z.string(),
  travelTips: z.array(z.string()),
});

export type DreamDestination = z.infer<typeof dreamDestinationSchema>;

export async function getTravelSuggestions(prompt: string): Promise<TravelSuggestion> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
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

export async function getDreamDestination(): Promise<DreamDestination> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert travel curator. Generate an exciting and unique travel destination suggestion. Focus on lesser-known but fascinating locations, including practical details and insider tips."
        },
        {
          role: "user",
          content: "Suggest a dream destination for travel with detailed information about activities, best time to visit, and travel tips."
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content received from OpenAI');
    }

    return dreamDestinationSchema.parse(JSON.parse(content));
  } catch (error) {
    console.error('Error getting dream destination:', error);
    throw error;
  }
}