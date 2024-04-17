import { pokedexGen } from "@/page";
import { type Sprites } from "@/types";
import Image from "next/image";

export default function Sprite({sprites, name}: {sprites:Sprites, name: string}) {
  return (
    <Image src={sprites.other.dream_world.front_default ?? sprites.front_default} width={pokedexGen.value === "4" ? "452" : "80"} height={pokedexGen.value === "4" ? "439" : "80"} alt={`${name} sprite`} className="pokemon-img" />
  )
}
