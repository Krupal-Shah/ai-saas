import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";

import { increaseApiLimit, checkApiLimit } from "@/lib/api_limit";
import { checkSubscription } from "@/lib/subscription";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body.prompt;
    const { genre } = body.genre;
    const isPro = await checkSubscription();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!replicate.auth) {
      return new NextResponse("API Key is not set", { status: 500 });
    }

    if (!prompt || !genre) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial && !isPro) {
      return new NextResponse("Exceeded API limit", { status: 403 });
    }
    
    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          alpha: 0.5,
          prompt_a: prompt,
          prompt_b: genre,
          denoising: 0.75,
          seed_image_id: "vibes",
          num_inference_steps: 50
        }
      }
    );

    if (!isPro){
      await increaseApiLimit();
    }


    return NextResponse.json({ audio: response });
  } catch (error) {
    console.error("Music Error: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
