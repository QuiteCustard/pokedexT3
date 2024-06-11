import { type Sprites } from "@/types";
import Image from "next/image";

export default function Sprite({sprites, name, id}: {sprites: Sprites, name: string, id: number}) {

  return (
    <Image src={`/pokemon-sprites/${id}.png` ?? sprites.other.home.front_default} width={80} height={80} alt={`${name} sprite`} className="pokemon-img" priority />
  )
}