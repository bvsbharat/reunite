import { GoogleGenAI, Type } from "@google/genai";

export interface GenerationParams {
  referenceImageBase64: string;
  name: string;
  gender: string;
  ageAtMissing: number;
  yearsMissing: number;
  location: string;
  scenario: string;
  additionalDetails: string;
  variationCount: number;
}

export interface PredictionResultItem {
  image: string;
  caption: string;
  id: string;
}

export const generatePredictionStream = async (
  params: GenerationParams,
  onResult: (item: PredictionResultItem) => void
): Promise<void> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // 1. Temporal Analysis & Prompt Engineering
    const today = new Date();
    
    const ageAtMissing = params.ageAtMissing;
    const yearsMissing = params.yearsMissing;
    const currentAge = ageAtMissing + yearsMissing;
    const approxMissingYear = today.getFullYear() - yearsMissing;

    const isAutoDetect = params.scenario.includes("AI Optimized");

    const systemInstruction = `
      You are a specialized Forensic Age Progression AI.
      Current Date: ${today.toLocaleDateString()}.
      
      Subject Data:
      - Name: ${params.name}
      - Gender: ${params.gender}
      - Age when lost: ${ageAtMissing}
      - Years Missing: ${yearsMissing} (Since approx ${approxMissingYear})
      - Current Age: ${currentAge}
      - Location: ${params.location}
      - Details: ${params.additionalDetails}

      CRITICAL SCENARIO CONSTRAINT:
      ${isAutoDetect 
        ? "Analyze the location and details to determine the most statistically plausible scenarios for this person." 
        : `BASE SCENARIO: "${params.scenario}". All generated variations MUST strictly adhere to this specific scenario.`}

      Task: Generate ${params.variationCount} distinct visual variation profiles.
      
      Requirements:
      1. All variations must be grounded in the Base Scenario (if specified). Do not generate generic aging unless the scenario asks for it.
      2. If Base Scenario is specified, explore how *different lifestyles* within that scenario would look in ${params.location} (e.g., if "Homeless", show "Sheltered vs. Rough Sleeper vs. Transient").
      3. Analyze biological aging from age ${ageAtMissing} to ${currentAge} specific to ${params.gender} biology.
      4. Incorporate environment-specific weathering, fashion, and grooming trends for ${today.getFullYear()} in ${params.location}.
      5. VARIATION STRATEGY:
         - If the requested count is 5 or more, OR if the scenario involves "Natural Aging", you MUST include one variation depicting 'Significant Weight Gain' (fuller face, double chin, heavier build) to account for metabolic changes, unless the base scenario is 'Starvation/Famine'.
      
      Output JSON format:
         - 'prompt': A description of the specific visual changes (aging, styling, weathering, clothing) to apply to the subject. Do NOT describe generic facial features (like "blue eyes" or "round face") unless they are changing due to age/health. The goal is to modify the REFERENCE IMAGE, not create a new person. Do NOT request changes to the pose, head angle, or camera composition.
         - 'reasoning': A forensic explanation of why they look this way, specifically linking the Base Scenario to the visual traits.
    `;

    // Generate the plan
    const planResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: "Generate the variation profiles.",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              prompt: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            },
            required: ["prompt", "reasoning"]
          }
        }
      }
    });

    let variations: { prompt: string; reasoning: string }[] = [];
    try {
      if (planResponse.text) {
        variations = JSON.parse(planResponse.text);
      }
    } catch (e) {
      console.error("Failed to parse variation plan", e);
      throw new Error("Failed to generate forensic profile plan.");
    }

    // 2. Sequential Image Generation (Sync Mode)
    // We iterate sequentially to ensure the first image is delivered and displayed as soon as possible,
    // maintaining the "sync mode" requirement.
    for (let index = 0; index < variations.length; index++) {
      const variation = variations[index];
      try {
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: params.referenceImageBase64
                }
              },
              {
                text: `
                  task: forensic_age_progression
                  
                  INSTRUCTIONS:
                  1. You are a forensic artist. Use the provided image as the STRICT REFERENCE for the subject's identity, facial structure, and key features.
                  2. Generate a photorealistic image of THIS SAME PERSON aged to ${currentAge} years old.
                  3. Do NOT create a random person. Maintain the likeness of the input face.
                  4. STRICTLY PRESERVE the head pose, camera angle, and composition of the reference image. 
                     - The subject must be in the exact same position.
                     - Do not mirror, rotate, or change the viewing angle.
                  5. Apply the following physical changes and context:
                  
                  SCENARIO DETAILS: ${variation.prompt}
                  
                  CONTEXT: ${params.scenario}
                  LOCATION: ${params.location}
                  GENDER: ${params.gender}
                  
                  Ensure photorealism, detailed skin texture, and correct anatomical aging structure while preserving identity.
                `
              }
            ]
          },
          config: {
            imageConfig: {
              aspectRatio: '16:9',
              imageSize: '1K'
            }
          }
        });

        let imageUrl = "";
        if (imageResponse.candidates && imageResponse.candidates[0].content.parts) {
          for (const part of imageResponse.candidates[0].content.parts) {
            if (part.inlineData) {
              imageUrl = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }
        }

        if (imageUrl) {
          onResult({
            id: `${Date.now()}-${index}`,
            image: imageUrl,
            caption: variation.reasoning
          });
        }
      } catch (err) {
        console.error(`Failed to generate variation ${index + 1}`, err);
        // Continue to next variation even if one fails
      }
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};