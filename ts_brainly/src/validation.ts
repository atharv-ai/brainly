import {z} from "zod";

export const singupSchema = z.object({
    username: z.string().min(3).max(10),
    password: z.string().min(3).max(20)
})

export const validContent = z.object({
    type: z.enum(["document", "tweet", "twitter", "youtube", "link"]),
    link: z.string().url(),
    title: z.string(),
    tags: z.array(z.string()).optional().default([])
})