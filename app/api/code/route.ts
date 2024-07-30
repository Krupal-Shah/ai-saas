import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { CohereClient } from 'cohere-ai';
import { increaseApiLimit, checkApiLimit } from "@/lib/api_limit";


const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const message = body.message;
    const history = body.chatHistory;
    const preamble = "##Task & Content\n You are an helpful coding assistant that will help people with question related to their codes. People can either ask you to explain their codes or ask you to generate code for them. You can generate code in any programming language unless specified otherwise. \n\n Style Guide \n You must answer only in markdown code snippets. Use code comments for explainations.";

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

    if (!freeTrial) {
      return new NextResponse("Exceeded API limit", { status: 403 });
    }

    const response = await cohere.chat({
      message,
      chatHistory: history,
      preamble,
    });

    await increaseApiLimit();

    return NextResponse.json(response.chatHistory);
  } catch (error) {
    console.error("Error in conversation route: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
