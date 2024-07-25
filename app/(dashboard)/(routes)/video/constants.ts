import * as z from "zod"

export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "Prompt is required",
    }),
    // Optional Parameters
    width: z.string().default("1024"),
    height: z.string().default("1024"),
});

export const widthOptions = [
    {
        value: "256",
        label: "256",
    },
    {
        value: "512",
        label: "512",
    },
    {
        value: "1024",
        label: "1024",
    },
    {
        value: "1280",
        label: "1280",
    },
]

export const heightOptions = [
    {
        value: "256",
        label: "256",
    },
    {
        value: "512",
        label: "512",
    },
    {
        value: "1024",
        label: "1024",
    },
    {
        value: "1280",
        label: "1280",
    },
]