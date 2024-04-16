"use server";
import type { genValues } from "@/page";
import { cookies } from "next/headers";

export async function setCookie(cookie: genValues) {
    cookies().set('theme', `gen${cookie}`);
}