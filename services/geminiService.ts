import { GoogleGenAI } from "@google/genai";
import { fileToBase64 } from '../utils/fileUtils';

// A simple delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateVideoFromImage(imageFile: File, prompt: string, aspectRatio: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey });

  try {
    const base64Image = await fileToBase64(imageFile);
    
    console.log("Starting video generation with prompt:", prompt, "and aspect ratio:", aspectRatio);
    let operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      image: {
        imageBytes: base64Image,
        mimeType: imageFile.type,
      },
      config: {
        numberOfVideos: 1,
        aspectRatio: aspectRatio,
      }
    });

    console.log("Polling for video generation status...");
    while (!operation.done) {
      await delay(10000); // Poll every 10 seconds
      operation = await ai.operations.getVideosOperation({ operation: operation });
      console.log("Current operation status:", operation.name, "Done:", operation.done);
    }

    if (operation.error) {
        throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Video generation succeeded, but no download link was found.");
    }

    console.log("Fetching generated video from:", downloadLink);
    // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
    const response = await fetch(`${downloadLink}&key=${apiKey}`);
    if (!response.ok) {
        throw new Error(`Failed to download video. Status: ${response.statusText}`);
    }

    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    
    console.log("Video URL created successfully.");
    return videoUrl;

  } catch (error: any) {
    console.error("Error in generateVideoFromImage:", error);
    throw new Error(error.message || "An unexpected error occurred during video generation.");
  }
}
