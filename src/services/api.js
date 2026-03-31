import toast from 'react-hot-toast';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const callGroq = async (apiKey, messages, model = "llama-3.1-8b-instant") => {
  if (!apiKey) {
    const msg = "API Key is missing. Please enter it in the top bar.";
    toast.error(msg);
    throw new Error(msg);
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
        response_format: messages.some(m => m.content.includes("JSON")) ? { type: "json_object" } : undefined
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to communicate with Groq API");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Groq API Error:", error);
    toast.error(error.message || "Failed to communicate with AI");
    throw error;
  }
};
