import Sprites from "@/components/sprites/Sprites"
import { getAbilityData } from "@/helpers/pokemon-getter"
import Link from "next/link";
import "./abilities.css";

export default async function page({params: {slug}}: {params: {slug: string}}) {
	const {effect_changes, effect_entries, flavor_text, name, pokemon} = await getAbilityData(slug)

  	return (
		<main className="custom-grid ability">
			<section className="ability-details">
				<h1>{name}</h1>
				<p>{flavor_text}</p>
				<p>{effect_entries}</p>
			</section>
			<section className="pokemon-with-ability">
				<h2>Pokemon with this ability</h2>
				<ul>
					{pokemon.map((poke) => (
						<li key={poke.name}>
							<Link href={`/pokemon/${poke.name}`} className="sprite-link">
								<div className="pokemon-img-wrapper">
									<Sprites sprites={[{src: poke.sprites.other.home?.front_default ?? poke.sprites?.other.home.front_default ?? poke.sprites?.front_default, alt: `${poke.name} sprite`}, {src: poke.sprites.other.home?.front_shiny ?? poke.sprites?.other.home.front_shiny ?? poke.sprites?.front_shiny, alt: `${poke.name} shiny sprite`}]} name={poke.name} height={100} width={100} />
								</div>
								<h3>{poke.name}</h3>
							</Link>
						</li>
					))}
				</ul>
			</section>
		</main>
  	)
}