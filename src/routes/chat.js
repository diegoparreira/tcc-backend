const express = require("express");
const chatRouter = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

chatRouter.get("/", async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "",
        },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    res.json({ response: response });
  } catch (error) {
    console.error("Erro ao lidar com a requisição:", error);
    res.status(500).json({ error: "Erro ao processar a requisição" });
  }
});

module.exports = chatRouter;
