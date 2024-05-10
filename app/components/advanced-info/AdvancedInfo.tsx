import type { AdvancedInfo } from "@/types"
import Link from "next/link"
import Image from "next/image";
import { getEvolutionDetail } from "@/helpers/pokemon-getter";

export default function AdvancedInfo({base_experience, base_happiness, capture_rate, growth_rate, egg_groups, abilities, evolution_chain, varieties, stats, sprites}: AdvancedInfo) {
  return (
    <section>
        <article className="advanced-info">
        <section className="stats-abilities">
            <div className="base-stats">
                <h2>Base Stats</h2>
                <ul>
                    {stats.map((stat, index) => 
                    <li key={index}>
                    <h3>{stat.stat.name}</h3>
                    <p>{stat.base_stat}</p>
                    </li>)}
                </ul>
            </div>
            <div>
                <h2>General data</h2>
                <ul>
                <li className="experience">
                    <h3>Base Experience</h3>
                    <p>{base_experience}</p>
                </li>
                <li>
                    <h3>Base Happiness</h3>
                    <p>{base_happiness}</p>
                </li>
                <li>
                    <h3>Capture Rate</h3>
                    <p>{capture_rate}</p>
                </li>
                {growth_rate ?
                    <li>
                        <h3>Growth Rate</h3>
                        <p>{growth_rate.replace(/-/g, " ")}</p>
                    </li> 
                : 
                 null
                }
                {egg_groups ?
                    <li>
                    <h3>Egg Group{egg_groups.length > 0 ? 's' : ''}</h3>
                    <p>{egg_groups.join(', ')}</p>
                    </li> 
                : 
                    null
                }
            </ul>
        </div>
        <div>
            <h2>Abilities</h2>
            <ul>
                {abilities.map((ability, index) => 
                <li key={index}>
                <h3>{ability.ability.name}</h3>
                <p>{ability.is_hidden ? 'Hidden' : 'Standard'}</p>
                </li>)}
            </ul>
        </div>
        </section>
        <section className="evolution-chain">
            {evolution_chain?.map((evolution, index) => (
            <article key={index}>
                <Link href={`/pokemon/${evolution.name}`}>
                <div className="img-wrapper">
                    <Image src={evolution.sprite ?? sprites.other.dream_world.front_default ?? sprites.front_default} alt={`${evolution.name} sprite`} width={100} height={100} />
                </div>
                <h2>{evolution.name}</h2>
                {evolution.evolution_details?.map((detail) => <p key={index}>{getEvolutionDetail(detail, index)}</p>)}
                </Link>
            </article>
            ))}
        </section>
        {varieties ? 
        <section className="varieties">
        <h2>Other Varieties</h2>
        <ul>
            
        </ul>
        </section> 
        : null
        }
        </article>
  </section>
  )
}
