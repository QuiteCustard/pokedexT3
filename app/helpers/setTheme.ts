"use server";
import type { genValues } from "@/page";
import { cookies } from "next/headers";

export async function setCookie(cookie: genValues) {
    console.log('setting cookie', cookie)
    cookies().set('theme', cookie)
}

export async function getCookie() {
    console.log(cookies().get('theme'))
    return cookies().get('theme')?.value as genValues
}