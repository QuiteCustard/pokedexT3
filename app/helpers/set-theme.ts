"use server";
import type { genValues } from "@/types";
import { cookies } from "next/headers";

export async function setTheme(cookie: genValues) {
    cookies().set('theme', `${cookie}`);
}

export async function getTheme() {
   const d = cookies().get("theme");
   return d?.value as genValues
}