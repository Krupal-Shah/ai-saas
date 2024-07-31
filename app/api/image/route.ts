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
    const { width } = body.width;
    const { height } = body.height;
    const isPro = await checkSubscription();

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

    if (!freeTrial && !isPro) {
      return new NextResponse("Exceeded API limit", { status: 403 });
    }

    const response = await replicate.run(
      "bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f",
      {
        input: {
          width: width,
          height: height,
          prompt: prompt,
          scheduler: "K_EULER",
          num_outputs: 1,
          guidance_scale: 0,
          negative_prompt: "worst quality, low quality",
          num_inference_steps: 4
        }
      }
    );
    if (!isPro){
      await increaseApiLimit();
    }
    return NextResponse.json({ video: response });
  } catch (error) {
    console.error("Music Error: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
