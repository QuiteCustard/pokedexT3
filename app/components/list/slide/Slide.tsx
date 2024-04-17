import { pokedexGen } from "@/page";
import { type PokemonSlide } from "@/types";
import Link from "next/link";
import Sprite from "./sprite/Sprite";


export default function Slide({sprites, name, id, url}: PokemonSlide) {
  return (
    <swiper-slide>
		<article className="pokemon">
			{pokedexGen.value === "gen4" ? <Link href={url}><Sprite sprites={sprites} name={name} /></Link> : <Sprite sprites={sprites} name={name} />}
			<Link className="name-id" href="/">
				<h3 className="pokemon-name">{name}</h3>
				<p className="pokemon-id">{pokedexGen.value === "gen4" && id < 100 ? "0" : ''}{pokedexGen.value === "gen4" && id < 10 ? "0" + id : id}</p>
			</Link>
		</article>
    </swiper-slide>
  )
}