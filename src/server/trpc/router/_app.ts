import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { messagesRouter } from "./messages";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  message: messagesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
