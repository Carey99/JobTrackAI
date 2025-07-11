import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface AIFeedbackResponse {
  matchScore: string;
  strengths: string;
  improvements: string;
  recommendations: string;
}

export async function generateAIFeedback(
  jobDescription: string, 
  resume: string
): Promise<AIFeedbackResponse> {
  try {
    const prompt = `
    You are an expert career counselor and resume reviewer. Analyze the following job description and resume to provide comprehensive feedback.

    Job Description:
    ${jobDescription}

    Resume/CV:
    ${resume}

    Please provide your analysis in the following JSON format:
    {
      "matchScore": "A percentage from 0-100% indicating how well the resume matches the job requirements",
      "strengths": "A detailed list of strengths and positive aspects that align with the job requirements",
      "improvements": "Specific areas where the resume could be improved to better match the job requirements",
      "recommendations": "Actionable recommendations for improving the application and interview preparation"
    }

    Focus on:
    - Technical skills alignment
    - Experience relevance
    - Cultural fit indicators
    - Missing qualifications
    - Specific suggestions for improvement
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert career counselor and resume reviewer. Provide detailed, actionable feedback in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      matchScore: result.matchScore || "0%",
      strengths: result.strengths || "No strengths identified",
      improvements: result.improvements || "No improvements identified",
      recommendations: result.recommendations || "No recommendations available"
    };
  } catch (error) {
    console.error("Error generating AI feedback:", error);
    throw new Error("Failed to generate AI feedback: " + (error as Error).message);
  }
}
