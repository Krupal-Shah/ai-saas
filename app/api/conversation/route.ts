import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { CohereClient } from 'cohere-ai';

import { increaseApiLimit, checkApiLimit } from "@/lib/api_limit";
import { checkSubscription } from "@/lib/subscription";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const message = body.message;
    const history = body.chatHistory;
    const isPro = await checkSubscription();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!cohere.checkApiKey()) {
      return new NextResponse("API Key is not set", { status: 500 });
    }

    if (!message) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial && !isPro) {
      return new NextResponse("Exceeded API limit", { status: 403 });
    }

    const response = await cohere.chat({
      message,
      chatHistory: history,
    });
    
    if (!isPro){
      await increaseApiLimit();
    }
  
    return NextResponse.json(response.chatHistory);
  } catch (error) {
    console.error("Error in conversation route: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
