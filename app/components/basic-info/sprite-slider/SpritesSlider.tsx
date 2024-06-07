"use client";
import { type Sprites } from "@/types";
import Image from "next/image";
import { register } from "swiper/element";
register();

export default function SpritesSlider({sprites, name}: {sprites: Sprites, name: string}) {
    return (
        <swiper-container>
           <swiper-slide>
                <Image src={sprites.other.home.front_default} alt={`${name} sprite`} width={512} height={512} priority />
            </swiper-slide>
            <swiper-slide>
                <Image src={sprites.other.home.front_shiny} alt={`${name} shiny sprite`} width={512} height={512} priority />
            </swiper-slide>
        </swiper-container>
    )
}