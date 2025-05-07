// utils/analyze.ts
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.GROQ_API,
  basePath: "https://api.groq.com/openai/v1",
});

const openai = new OpenAIApi(configuration);

export const summarizeContent = async (paragraphs: string[]) => {
  const content = paragraphs.join("\n\n");

  const response = await openai.createChatCompletion({
    model: "llama3-70b-8192",
    messages: [
      {
        role: "user",
        content: `Summarize the following content in about 100 words. Cover all key points:\n\n${content}`,
      },
    ],
  });

  return response.data.choices[0]?.message?.content?.trim();
};
