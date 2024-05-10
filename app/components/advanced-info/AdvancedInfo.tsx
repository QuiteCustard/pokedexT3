import type { AdvancedInfo } from "@/types"

export default function AdvancedInfo({base_experience, base_happiness, capture_rate, growth_rate, egg_groups, abilities, stats}: AdvancedInfo) {
  return (
    <section className="advanced-info">
        <article>
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
        </article>
  </section>
  )
}
