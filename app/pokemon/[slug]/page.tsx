import {  pokemonURL, speciesURL } from "@/helpers/pokemon-getter";
import type { Chain, CompletedPokemon, DetailedPokemon, EvolutionChain, EvolutionChainData, EvolutionDetails, Stat } from "@/types";
import "@/pokemon/pokemon.css";
import Image from "next/image";
import Link from "next/link";

type Results = {
  name: string,
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
        result.push({
          name: node.species.name,
          evolution_details: node.evolution_details,
        });
      }
  
      if (node.evolves_to.length > 0) node.evolves_to.forEach(traverse);
    }
  
    traverse(chain);
  
    return result;
  }

  const evolutionData = extractEvolutionData(data.chain);

  const evolutions = await Promise.all(
    evolutionData.map(async ({name, evolution_details}) => {
      const d = [];

      if (evolution_details.length > 0) {
        evolution_details.map(mon => {
          const filteredMon = {};
          for (const key in mon) {
            if (Boolean(mon[key])){
              filteredMon[key] = mon[key];
            }
          }
          d.push(filteredMon);
        });
      }

      if (name === currentName) return { name, ...(evolution_details.length > 0 && { evolution_details })}
      const response = await fetch(`${pokemonURL}/${name}`);
      if (!response.ok) throw new Error('Critical error');
      const pokemonData = await response.json() as DetailedPokemon;
      return { name, sprite: pokemonData.sprites.other.dream_world.front_default ?? pokemonData.sprites.front_default, ...(evolution_details.length > 0 && { evolution_details })};
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
  const evolutionChain = await getEvolutionChain(data[1]?.evolution_chain?.url ?? '', data[0].name);

  const completeData: CompletedPokemon = {
    abilities: abilities,
    base_experience: base_experience,
    base_happiness: base_happiness,
    capture_rate: capture_rate,
    cries: cries,
    egg_groups: eggGroups,
    evolution_chain: evolutionChain,
    flavor_text: englishFlavourText?.flavor_text,
    genus: englishGenusEntry?.genus,
    growth_rate: growth_rate.name,
    height: height,
    id: id,
    location_area_encounters: location_area_encounters,
    moves: moves,
    name: name,
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

  console.log(evolution_chain )

  const formattedStats: Stat[] = stats.map((stat) => {
    return {
      ...stat,
      stat: {
        ...stat.stat,
        name: stat.stat.name.includes('-') ? stat.stat.name.replace('-', ' ') : stat.stat.name,
      },
    }
  })

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
              </Link>
            </article>
          ))}
        </section>
      </article>
    </section>
    </main>
  )
}