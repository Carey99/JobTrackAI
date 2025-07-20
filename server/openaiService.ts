import dotenv from "dotenv";
dotenv.config();

export interface AIFeedbackResponse {
  matchScore: string;
  strengths: string;
  improvements: string;
  recommendations: string;
}

// Input validation functions
function validateJobDescription(jobDescription: string): boolean {
  const minLength = 50;
  const requiredKeywords = ['experience', 'skills', 'requirements', 'responsibilities', 'qualifications'];
  
  if (jobDescription.length < minLength) return false;
  
  const hasKeywords = requiredKeywords.some(keyword => 
    jobDescription.toLowerCase().includes(keyword)
  );
  
  return hasKeywords;
}

function validateResume(resume: string): boolean {
  const minLength = 100;
  const requiredSections = ['experience', 'education', 'skills', 'work', 'university', 'college'];
  
  if (resume.length < minLength) return false;
  
  const hasSections = requiredSections.some(section => 
    resume.toLowerCase().includes(section)
  );
  
  return hasSections;
}

export async function generateAIFeedback(
  jobDescription: string, 
  resume: string
): Promise<AIFeedbackResponse> {
  try {
    // Validate inputs first
    if (!validateJobDescription(jobDescription)) {
      return {
        matchScore: "0%",
        strengths: "Invalid job description provided.",
        improvements: "Please provide a proper job description with requirements and responsibilities.",
        recommendations: "Ensure the job description includes key sections like qualifications, experience requirements, and job responsibilities."
      };
    }

    if (!validateResume(resume)) {
      return {
        matchScore: "0%",
        strengths: "Invalid resume provided.",
        improvements: "Please provide a proper resume with experience, education, and skills sections.",
        recommendations: "Ensure your resume includes your work experience, education background, and relevant skills."
      };
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      console.log("No Groq API key found, using mock data");
      return getMockFeedback();
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: `You are a strict career counselor and resume reviewer. You must be critical and honest in your assessment. 

IMPORTANT GUIDELINES:
- If the resume lacks relevant experience, give a LOW score (20-40%)
- If the resume has some relevant experience, give a MEDIUM score (50-70%)  
- Only give HIGH scores (80%+) if there's strong alignment
- Be harsh about missing qualifications
- Point out specific gaps and weaknesses
- Don't be overly positive

Provide feedback in JSON format only.`
          },
          {
            role: "user",
            content: `Analyze this job description and resume critically. Be strict in your scoring.

Job Description:
${jobDescription}

Resume:
${resume}

Return ONLY JSON in this format:
{
  "matchScore": "X%" (be realistic - most candidates should get 40-70%),
  "strengths": "List specific strengths that match the job",
  "improvements": "List specific gaps and weaknesses", 
  "recommendations": "Specific actionable advice"
}`
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent, less creative responses
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from Groq API');
    }

    const result = JSON.parse(data.choices[0].message.content);
    
    return {
      matchScore: result.matchScore || "45%",
      strengths: result.strengths || "Limited relevant experience identified",
      improvements: result.improvements || "Significant gaps in required qualifications",
      recommendations: result.recommendations || "Focus on gaining relevant experience and skills"
    };
    
  } catch (error) {
    console.error("Error with AI service:", error);
    return getMockFeedback();
  }
}

function getMockFeedback(): AIFeedbackResponse {
  // More realistic mock scores (not always high)
  const scores = ["45%", "52%", "38%", "67%", "41%", "58%", "73%", "29%"];
  return {
    matchScore: scores[Math.floor(Math.random() * scores.length)],
    strengths: "Some relevant technical skills identified. Educational background shows potential for growth.",
    improvements: "Missing several key qualifications mentioned in job posting. Limited demonstrable experience in required technologies. Need more specific achievements and metrics.",
    recommendations: "Gain hands-on experience with the required technologies. Consider relevant certifications. Add quantifiable achievements to demonstrate impact."
  };
}
