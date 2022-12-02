import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const API_URL =
  "https://api-inference.huggingface.co/models/mrm8488/t5-base-finetuned-emotion";
const HEADERS = new Headers();
HEADERS.append("Authorization", "Bearer " + process.env.HFACE_TOKEN);

export const messagesRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany({
      include: {
        user: true,
      },
    });
  }),

  create: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    // Create user message in DB
    try {
      await ctx.prisma.message.create({
        data: {
          text: input,
          userId: ctx.session?.user?.id,
        },
      });
    } catch (e) {
      console.error("Error creating user message", e);
      return;
    }

    // Send user message to API to get emotion response
    const requestInit: RequestInit = {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ inputs: input }),
    };
    const response = await fetch(API_URL, requestInit);
    if (!response.ok) {
      console.error("Error getting emotion response");
      console.error(await response.text());
    }

    // Create AI message from JSON response
    const json = await response.json();
    const emotion = json[0].generated_text;
    try {
      await ctx.prisma.message.create({
        data: {
          text: `Damn u sure are feeling ${emotion} imo`,
          ai: true,
        },
      });
    } catch (e) {
      console.error("Error creating AI message", e);
      return;
    }
  }),
});
