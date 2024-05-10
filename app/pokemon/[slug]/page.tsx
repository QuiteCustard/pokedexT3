import {  pokemonURL, speciesURL } from "@/helpers/pokemon-getter";
import type { Chain, CompletedPokemon, DetailedPokemon, EvolutionChain, EvolutionChainData, EvolutionDetails, Stat } from "@/types";
import "@/pokemon/pokemon.css";
import Image from "next/image";
import Link from "next/link";
import { descriptionFormats, keysToReplace, triggerFormats } from "@/helpers/description-formats";
import { notFound } from "next/navigation";

type Results = {
  name: string,
  id?: number,
  evolution_details: EvolutionDetails[]
}

async function getEvolutionChain(url: string, currentName: string) {
  if (url === '') return;

  const f = await fetch(url);

  if (!f) notFound();

  const data = await f.json() as EvolutionChainData;

  function extractEvolutionData(chain: Chain) {
    const result: Results[] = [];
  
    function traverse(node: Chain) {
      if (node.species) {
        const idMatch = node.species.url.match(/(\d+)\/?$/);
        const id = idMatch ? Number(idMatch[1]) : undefined;
        result.push({
          id: id,
          evolution_details: node.evolution_details,
          name: node.species.name
        });
      }
  
      if (node.evolves_to.length > 0) node.evolves_to.forEach(traverse);
    }
  
    traverse(chain);
  
    return result;
  }

  const evolutionData = extractEvolutionData(data.chain);

  const evolutions = await Promise.all(
    evolutionData.map(async ({name, evolution_details, id}) => {
      const details = evolution_details.map(mon => Object.fromEntries(Object.entries(mon).filter(([_,val]) => val)))

      if (name === currentName) return { name, ...(details.length > 0 && { evolution_details: details })}

      const response = await fetch(`${pokemonURL}/${id}`);
      if (!response.ok) return {name}

      const pokemonData = await response.json() as DetailedPokemon;
      return { 
        name, 
        sprite: pokemonData.sprites.other.dream_world.front_default ?? pokemonData.sprites.front_default, 
        ...(details.length > 0 && { evolution_details: details })
      };
      })
  )

  return evolutions as EvolutionChain[];
}

async function getData(slug: string) {
  const controller = new AbortController();
  const signal = controller.signal;

  async function fetchData(url: string, signal: AbortSignal) {
    const data = await fetch(url, {signal});
    return await data.json() as DetailedPokemon;
  }

  try {
    const {id, base_happiness, capture_rate, growth_rate, flavor_text_entries, genera, egg_groups, evolution_chain, varieties, name: speciesName} = await fetchData(`${speciesURL}/${slug.toLowerCase()}`, signal);
    const {abilities, base_experience, height, location_area_encounters, moves, name: monName, sprites, stats, types, weight, cries} = await fetchData(`${pokemonURL}/${id}`, signal);
    const englishFlavourText = [...flavor_text_entries ?? []].reverse().find((entry) => entry.language.name === 'en');
    const englishGenusEntry = genera?.find((entry) => entry.language.name === 'en');
    const filteredVarieties = varieties?.map(variety => variety.pokemon.name) ?? [];
    const eggGroups = egg_groups?.map((group) => group.name) ?? [];
    const evolutionChain = await getEvolutionChain(evolution_chain?.url ?? '', monName) ?? '';
  
    const completeData: CompletedPokemon = {
      abilities: abilities,
      base_experience: base_experience,
      base_happiness: base_happiness,
      capture_rate: capture_rate,
      cries: cries,
      egg_groups: eggGroups,
      evolution_chain: evolutionChain as EvolutionChain[] | undefined,
      flavor_text: englishFlavourText?.flavor_text,
      genus: englishGenusEntry?.genus,
      growth_rate: growth_rate.name,
      height: height,
      id: id,
      location_area_encounters: location_area_encounters,
      moves: moves,
      name: speciesName.replace(/-/g, ' '),
      sprites: sprites,
      stats: stats,
      types: types,
      weight: weight,
      varieties: filteredVarieties
    }
 
    return completeData;
  } catch (error) {
    notFound();
  }
}
 
export default async function Page({params: {slug}}: {params: {slug: string}}) {
  const data: CompletedPokemon = await getData(slug)
  const {name, id, sprites, types, flavor_text, genus, height, weight, base_experience, base_happiness, capture_rate, growth_rate, location_area_encounters, abilities, stats, egg_groups, moves, evolution_chain, varieties} = data;

  const formattedStats: Stat[] = stats.map((stat) => {
    return {
      ...stat,
      stat: {
        ...stat.stat,
        name: stat.stat.name.includes('-') ? stat.stat.name.replace(/-/g, ' ') : stat.stat.name,
      },
    }
  })

  function getEvolutionDetail(detail: EvolutionDetails, index: number) {
    function formatValue<K extends keyof EvolutionDetails>(value: EvolutionDetails[K], key: K, detail: EvolutionDetails) {
      if (typeof value === 'object' && value !== null && 'name' in value) {
        if (keysToReplace.includes(key.toString())) {
          const prefix = key === 'known_move' && detail.trigger && ['agile-style-move', 'strong-style-move'].includes(detail.trigger.name) ? 'Master ' : '';
          return `${prefix}${value.name.replace(/-/g, ' ')}`;
        }
      } else if (typeof value === 'boolean') {
        return value ? '' : null;
      }
      return value?.toString();
    };
    
    function generateDescription() {
      const descriptions = Object.entries(detail).reduce((acc, [key, value]) => {
        if (key !== 'trigger' && descriptionFormats[key]) {
          const formattedValue = formatValue(value, key, detail);
          if (formattedValue !== null) acc.push(`${descriptionFormats[key]} ${formattedValue}`);
        }
        return acc;
      }, [] as string[]);
    
      let description = descriptions.join(', ');
    
      if (detail.trigger && triggerFormats[detail.trigger.name]) {
        if (detail.trigger.name === 'use-item' && detail.item?.name) {
          description = `${triggerFormats[detail.trigger.name]} ${detail.item.name.replace(/-/g, ' ')} ${description}`;
        } else if (!['agile-style-move', 'strong-style-move'].includes(detail.trigger.name)) {
          description = `${triggerFormats[detail.trigger.name]} ${description}`;
        }
      }
    
      return description;
    }
    
    return <p key={index}>{generateDescription()}</p>
  }

  console.log(egg_groups)

  return (
    <main>
      <section>
        <article className="basic-info">
          <section className="details">
            <div>
              <h1>{name}</h1>
              <h2>No. {id}</h2>
            </div>
            <p>{genus}</p>
            <ul className="types">
              {types.map((type, index) => 
              <li key={index} className={`type-${type.type.name}`}>
                <Image src={`/types/${type.type.name}.webp`} alt={`${type.type.name} type`} width={40} height={33} />
                {type.type.name}
              </li>)}
            </ul>
          </section>
          <section className="flavour-text">
            <p>{flavor_text}</p>
          </section>
          <section className="main-sprite">
            <Image src={sprites.other.dream_world.front_default ?? sprites.front_default} alt={`${name} sprite`} width={300} height={300} />
          </section>
          <section className="attributes">
            <div>
              <h3>Height</h3>
              <p>{height / 10} meters</p>
            </div>
            <div>
              <h3>Weight</h3>
              <p>{weight / 10} Kilograms</p>
            </div>
          </section>
        </article>
      </section>
      <section>
        <article className="advanced-info">
          <section className="stats-abilities">
            <div className="base-stats">
              <h2>Base Stats</h2>
              <ul>
                {formattedStats.map((stat, index) => 
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
              <li>
                <h3>Growth Rate</h3>
                <p>{growth_rate.replace(/-/g, " ")}</p>
              </li>
              <li>
                <h3>Egg Group{egg_groups.length > 0 ? 's' : ''}</h3>
                <p>{egg_groups.join(', ')}</p>
              </li>
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
                  {evolution.evolution_details?.map((detail) => getEvolutionDetail(detail, index))}
                </Link>
              </article>
            ))}
          </section>
        </article>
      </section>
    </main>
  )
}