import Sprites from "@/components/sprites/Sprites";
import { getMoveData } from "@/helpers/pokemon-getter"
import Link from "next/link";
import Image from "next/image";

export default async function page({params: {slug}}: {params: {slug: string}}) {
    const {flavor_text, pokemon, accuracy, power, pp, type, contest_combos, effect_entries, meta: {ailment, ailment_chance, category: {name: cat_name}, crit_rate, drain, flinch_chance, healing, max_hits, max_turns,stat_chance, min_hits, min_turns}, priority, target, contest_type, damage_class, name} = await getMoveData(slug.toLowerCase());

    //console.log(effect_changes, accuracy, power, pp, type, contest_combos, machines, meta, priority, target, contest_type, damage_class)
    console.log(damage_class)
    return (
		<main className="custom-grid ability-move">
			<section className="ability-move-details">
				<h1 className="focus-heading">{name.replace(/-/g, " ")}</h1>
				<p>{flavor_text}</p>
				<p>{effect_entries}</p>
                <div className="stat-groups">
                    <article className="base-stats">
                        <h2>Base stats</h2>
                        <ul className="stats">
                            <li>
                                <h3>Accuracy</h3>
                                <p>{accuracy + "%" ?? '-'}</p>
                            </li>
                            <li>
                                <h3>Power</h3>
                                <p>{power ?? '-'}</p>
                            </li>
                            <li>
                                <h3>PP</h3>
                                <p>{pp}</p>
                            </li>
                            <li>
                                <h3>Class</h3>
                                <p>{damage_class}</p>
                            </li>
                            <li>
                                <h3>Type</h3>
                                <div className={`type type-${type}`}>
                                    <Image src={`/types/${type}.webp`} alt={`${type} type`} width={48} height={42} />
                                    {type}
                                </div>
                            </li>
                        </ul>
                    </article>
                    <article className="extended-stats">
                        <h2>Extended stats</h2>
                        <ul className="stats">
                            <li>
                                <h3>Category</h3>
                                <p>{cat_name.replace("+", ", ")}</p>
                            </li>
                            <li>
                                <h3>Priority</h3>
                                <p>{priority}</p>
                            </li>
                            <li>
                                <h3>Target</h3>
                                <p>{target.replace(/-/g, " ")}</p>
                            </li>
                            {crit_rate > 0 ? 
                                <li>
                                    <h3> Crit rate</h3>
                                    <p>{crit_rate}</p>
                                </li>
                            : null}
                            {flinch_chance > 0 ? 
                                <li>
                                    <h3>Flinch chance</h3>
                                    <p>{flinch_chance}</p>
                                </li>
                            : null}
                            {healing > 0 ? 
                                <li>
                                    <h3>Healing</h3>
                                    <p>{healing}</p>
                                </li>
                            : null}
                            {max_hits && min_hits ? 
                                <li>
                                    <h3>Amount of hits</h3>
                                    <p>{min_hits} - {max_hits}</p>
                                </li>
                            : null}
                            {max_turns && min_turns ? 
                                <li>
                                    <h3>Amount of turns</h3>
                                    <p>{min_turns} - {max_turns}</p>
                                </li>
                            : null}
                            {stat_chance > 0 ?  
                                <li>
                                    <h3>Stat chance</h3>
                                    <p>{stat_chance}</p>
                                </li>
                            : null}
                            {drain > 0 ? 
                                <li>
                                    <h3>Drain</h3>
                                    <p>{drain}</p>
                                </li>
                            : null}
                            {ailment ?
                                <li>
                                    <h3>Ailment</h3>
                                    <p>{ailment_chance}% chance of {ailment.name}</p>
                            </li>
                            : null}
                        </ul>
                    </article>
                </div>
			</section>
			<section className="pokemon-with-ability-move">
				<h2>Pokemon capable of learning this move</h2>
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