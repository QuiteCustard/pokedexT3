import { type PokemonArticle } from "@/types";
import Link from "next/link";
import "@/components/list/pokemon-article/pokemon-article.css";
import Sprites from "@/components/sprites/Sprites";

export default function Pokemon({sprites, name, id}: PokemonArticle) {
  return (
	<article className="pokemon-article">
		<Link href={`/pokemon/${id}`}>
			<Sprites sprites={[{src: sprites.other?.["official-artwork"]?.front_default, alt: `${name} sprite`}, {src: sprites.other?.["official-artwork"]?.front_shiny, alt: `${name} shiny sprite`}]} name={name} height={100} width={100} />
			<h2 className="pokemon-name">{name}</h2>
			<p className="pokemon-id">{id}</p>
		</Link>
	</article>
  )
}