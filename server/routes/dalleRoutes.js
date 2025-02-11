/* eslint-disable quotes */
import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { HfInference } from "@huggingface/inference";


dotenv.config();

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new HfInference(process.env.HUGGING_FACE_API_KEY);



const openai = new OpenAIApi(configuration);

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("++++++++++++");
    console.log(client);
    const aiResponse = await client.textToImage({
      model: 'stabilityai/stable-diffusion-3.5-large',
      inputs: prompt,
      parameters: { num_inference_steps: 50 },
      provider: 'hf-inference',
    });

    console.log("++++++++++++");
    console.log(aiResponse);
    const arrayBuffer = await aiResponse.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    res.status(200).json({
      image: `data:image/jpeg;base64,${base64Image}`,
    });
  } catch (error) {
    console.error('Image generation failed:', error);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});


export default router;
