import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";

import { increaseApiLimit, checkApiLimit } from "@/lib/api_limit";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body.prompt;
    const { width } = body.width;
    const { height } = body.height;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!replicate.auth) {
      return new NextResponse("API Key is not set", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Messages are required", { status: 400 });
    }
    
    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse("Exceeded API limit", { status: 403 });
    }

    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          fps: 24,
          model: "xl",
          width,
          height,
          prompt,
          batch_size: 1,
          num_frames: 24,
          init_weight: 0.5,
          guidance_scale: 17.5,
          negative_prompt: "very blue, dust, noisy, washed out, ugly, distorted, broken",
          remove_watermark: true,
          num_inference_steps: 50
        }
      }
    );
    
    await increaseApiLimit();

    return NextResponse.json({ audio: response });
  } catch (error) {
    console.error("Music Error: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
