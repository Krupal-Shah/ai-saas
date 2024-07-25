import * as z from "zod"

export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "Prompt is required",
    }),
    genre: z.string().min(1, {
        message: "Genre is required",
    }),
});