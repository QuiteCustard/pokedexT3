import {  pokemonURL, speciesURL } from "@/helpers/pokemon-getter";
import type { Chain, CompletedPokemon, DetailedPokemon, EvolutionChain, EvolutionChainData, EvolutionDetails, Stat } from "@/types";
import "@/pokemon/pokemon.css";
import Image from "next/image";
import Link from "next/link";

type Results = {
  name: string,
  id?: number,
  evolution_details: EvolutionDetails[]
}

async function getEvolutionChain(url: string, currentName: string) {
  if (url === '') return;

  const f = await fetch(url);

  if (!f) throw new Error('Critical error');

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
  const urls = [`${pokemonURL}/${slug}`, `${speciesURL}/${slug}`];
  
  const data: DetailedPokemon[] = await Promise.all(urls.map(async url => {
    const response = await fetch(url, {signal});
    if (!response.ok) throw new Error('Critical error');
    const pokemonData = await response.json() as DetailedPokemon;
    return pokemonData;
  }))

  if (data[0] === undefined || data[1] === undefined) throw new Error('Pokemon not found');
  const {abilities, base_experience, height, id, location_area_encounters, moves, name, sprites, stats, types, weight, cries} = data[0];
  const {base_happiness, capture_rate, growth_rate} = data[1];
  const englishFlavourText = [...data[1]?.flavor_text_entries ?? []].reverse().find((entry) => entry.language.name === 'en');
  const englishGenusEntry = data[1]?.genera?.find((entry) => entry.language.name === 'en');
  const varieties = data[1]?.varieties?.map((variety) => variety.pokemon.name).filter((name) => name !== data[0]?.name) ?? [];
  const eggGroups = data[1]?.egg_groups?.map((group) => group.name) ?? [];
  const evolutionChain = await getEvolutionChain(data[1]?.evolution_chain?.url ?? '', data[0].name) ?? ''

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
    name: name.replace('-', ' '),
    sprites: sprites,
    stats: stats,
    types: types,
    weight: weight,
    varieties: varieties
  }

  return completeData;
}
 
export default async function Page({params: {slug}}: {params: {slug: string}}) {
  const data: CompletedPokemon = await getData(slug)
  const {name, id, sprites, types, flavor_text, genus, height, weight, base_experience, base_happiness, capture_rate, growth_rate, location_area_encounters, abilities, stats, egg_groups, moves, evolution_chain, varieties} = data;

  const formattedStats: Stat[] = stats.map((stat) => {
    return {
      ...stat,
      stat: {
        ...stat.stat,
        name: stat.stat.name.includes('-') ? stat.stat.name.replace('-', ' ') : stat.stat.name,
      },
    }
  })

  function getEvolutionDetail(detail: EvolutionDetails, index: number, name: string) {

    function generateDescription() {
      const triggerFormats = {
        'level-up': 'Level up',
        'use-item': 'Use',
        'trade': 'Trade',
        'strong-style-move': 'Use a strong style move',
        'agile-style-move': 'Use an agile style move',
        'shed': 'Shed',
        'three-critical-hits': 'Land three critical hits',
        'take-damage': 'Take damage',
        'recoil-damage': 'Take recoil damage',
        'spin': 'Spin your character around',
        'other': 'Other method of evolution',
      };
      
      const descriptionFormats = {
        'min_affection': 'with a minimum affection of',
        'min_beauty': 'with a minimum beauty of',
        'time_of_day': 'during the',
        'gender': 'being a',
        'held_item': 'while holding',
        'min_level': 'at level',
        'needs_overworld_rain': 'in the rain',
        'party_species': 'with',
        'trade_species': 'for',
        'location': 'at',
        'known_move': 'while knowing',
        'known_move_type': 'knowing a move of type',
      };
      
      const descriptions = [];
      
      for (const key in detail) {
        if (key !== 'trigger' && descriptionFormats[key]) {
          let value = detail[key];
          if (key === 'held_item' && value.name) {
            value = value.name.replace(/-/g, ' ');
          } else if (key === 'trade_species' && value.name) {
            value = value.name.replace(/-/g, ' ');
          } else if (key === 'needs_overworld_rain') {
            if (value) {
              descriptions.push(descriptionFormats[key]);
            }
            continue;
          }
          else if (key === 'location' && value.name) {
            value = value.name.replace(/-/g, ' ');
          }
          else if (key === 'known_move_type' && value.name) {
            value = value.name.replace(/-/g, ' ');
          }
          else if (key === 'known_move' && value.name) {
            if (detail.trigger && (detail.trigger.name === 'agile-style-move' || detail.trigger.name === 'strong-style-move')) {
              descriptionFormats[key] = 'Master';
              value = `${value.name.replace(/-/g, ' ')}`;
            } else {
              value = `${value.name.replace(/-/g, ' ')}`;
            }
          }
      
          descriptions.push(`${descriptionFormats[key]} ${value}`);
        }
      }
      
      let description = descriptions.join(', ');
      
      if (detail.trigger && triggerFormats[detail.trigger.name]) {
        if (detail.trigger.name === 'use-item' && detail.item && detail.item.name) {
          description = `${triggerFormats[detail.trigger.name]} ${detail.item.name.replace(/-/g, ' ')} ${description}`;
        } else if (detail.trigger.name !== 'agile-style-move' && detail.trigger.name !== 'strong-style-move') {
          description = `${triggerFormats[detail.trigger.name]} ${description}`;
        }
      }
      console.log(detail)
      return description;
    }
    return <p key={index}>{generateDescription()}</p>
  }

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
        <section className="stats">
          <h2>Base Stats</h2>
          <ul>
            {formattedStats.map((stat, index) => 
            <li key={index}>
              <h3>{stat.stat.name}</h3>
              <p>{stat.base_stat}</p>
            </li>)}
            <li className="experience">
              <h3>Base Experience</h3>
              <p>{base_experience}</p>
            </li>
            <li>
              <h3>Base Happiness</h3>
              <p>{base_happiness}</p>
            </li>
          </ul>
        </section>
        <section>
          <h2>Abilities</h2>
          <ul>
            {abilities.map((ability, index) => 
            <li key={index}>
              <h3>{ability.ability.name}</h3>
              <p>{ability.is_hidden ? 'Hidden' : 'Standard'}</p>
            </li>)}
          </ul>
        </section>
        <section className="evolution-chain">
          {evolution_chain?.map((evolution, index) => (
            <article key={index}>
              <Link href={`/pokemon/${evolution.name}`}>
                <div className="img-wrapper">
                  <Image src={evolution.sprite ?? sprites.other.dream_world.front_default ?? sprites.front_default} alt={`${evolution.name} sprite`} width={100} height={100} />
                </div>
                <h2>{evolution.name}</h2>
                {evolution.evolution_details?.map((detail) => getEvolutionDetail(detail, index, evolution_chain[0]?.name ?? ''))}
              </Link>
            </article>
          ))}
        </section>
      </article>
    </section>
    </main>
  )
}