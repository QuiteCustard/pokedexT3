import { type PokemonArticle } from "@/types";
import Link from "next/link";
import Sprite from "./sprite/Sprite";
import "@/components/list/pokemon-article/pokemon-article.css";

export default function Pokemon({sprites, name, id}: PokemonArticle) {
  return (
	<article className="pokemon-article">
		<Link href={`/pokemon/${id}`}>
			<Sprite sprites={sprites} name={name} id={id} />
			<h2 className="pokemon-name">{name}</h2>
			<p className="pokemon-id">{id}</p>
		</Link>
	</article>
  )
}