import { type Sprites } from "@/types";
import Image from "next/image";
import { useState } from "react";

export default function Sprite({sprites, name, id}: {sprites: Sprites, name: string, id: number}) {
	const [imgSrc, setImgSrc] = useState(`/pokemon-sprites/${id}.png`);

	function onError() {
		setImgSrc(sprites.other.home.front_default);
	};

	return (
		<Image src={imgSrc} onError={onError} width={80} height={80} alt={`${name} sprite`} className="pokemon-img" priority />
	)
}