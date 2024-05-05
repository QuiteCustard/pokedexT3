import { type PokemonSlide } from "@/types";
import Link from "next/link";
import Sprite from "./sprite/Sprite";
import "@/components/list/pokemon-article/pokemon-article.css";

export default function Pokemon({sprites, name, id, url}: PokemonSlide) {
  return (
	<article className="pokemon-article">
		<Link href={url}>
			<Sprite sprites={sprites} name={name} />
			<h3 className="pokemon-name">{name}</h3>
			<p className="pokemon-id">{id}</p>
		</Link>
	</article>
  )
}