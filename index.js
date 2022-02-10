import express from "express";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();

app.get("/api/emoji", async (req, res) => {
  if (
    !req.headers.supersecretheader ||
    req.headers.supersecretheader !== process.env.SUPER_SECRET_HEADER
  )
    return res.status(401).send("You don't know the password!");

  const { input } = req.query;
  if (!input) return res.status(400).send("You need to send an input!");

  try {
    const response = await openai.createCompletion("text-davinci-001", {
      prompt: `Assign an emoji to the following sentence.\n\nSentence: \"${input}\"\nEmoji:`,
      temperature: 0,
      max_tokens: 6,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\n"],
    });
    res.send(response.data.choices[0].text);
  } catch (error) {
    res.status(400).send(error);
  }
});

const port = process.env.PORT || 420;
app.listen(port, () => console.log(`Listening on port ${port}`));
