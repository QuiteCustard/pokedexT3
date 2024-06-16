import { type Sprites } from "@/types";
import Image from "next/image";

export default function Sprite({sprites, name}: {sprites: Sprites, name: string}) {
	return (
		<Image src={sprites.other.home.front_default} width={80} height={80} alt={`${name} sprite`} className="pokemon-img" priority />
	)
}