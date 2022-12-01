import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const API_URL =
  "https://api-inference.huggingface.co/models/mrm8488/t5-base-finetuned-emotion";
const HEADERS = new Headers();
HEADERS.append(
  "Authorization",
  "Bearer " + process.env.NEXT_PUBLIC_HFACE_TOKEN
);

export const messagesRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany();
  }),

  create: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    // Create user message in DB
    const newMsg = await ctx.prisma.message.create({
      data: {
        text: input,
        userId: ctx.session?.user?.id,
      },
    });

    // Send user message to API to get emotion response
    const requestInit: RequestInit = {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ inputs: input }),
    };
    const response = await fetch(API_URL, requestInit);
    if (!response.ok) {
      console.error(await response.text());
      return;
    }

    // Create AI message from JSON response
    const json = await response.json();
    const emotion = json[0].generated_text;
    const newAiMsg = await ctx.prisma.message.create({
      data: {
        text: `Damn u sure are feeling ${emotion} imo`,
        ai: true,
      },
    });
  }),
});
