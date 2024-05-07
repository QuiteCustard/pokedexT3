import {  pokemonURL, speciesURL } from "@/helpers/pokemon-getter";
import type { CompletedPokemon, DetailedPokemon, Sprites } from "@/types";
import "@/pokemon/pokemon.css";
import Image from "next/image";

type EvoChain = {
  chain: {
    species: {
      name: string
    },
    evolves_to: [
      {
        species: {
          name: string
        }
      }
    ]
  }
}

async function getEvolutionChain(url: string) {
  if (url === '') return;

  const f = await fetch(url);

  if (!f) throw new Error('Critical error');

  const data = await f.json() as EvoChain;
  const names = [data.chain.evolves_to[0].species.name, data.chain.species.name]

  const sprites = await Promise.all(names.map(async name => {
    const response = await fetch(`${pokemonURL}/${name}`);
    if (!response.ok) throw new Error('Critical error');
    const pokemonData = await response.json() as DetailedPokemon;

    return pokemonData.sprites;
  }))

  return sprites.map((sprite: Sprites) => sprite.other.dream_world.front_default ?? sprite.front_default);
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

  const englishFlavourText = [...data[1]?.flavor_text_entries ?? []].reverse().find((entry) => entry.language.name === 'en');
  const englishGenusEntry = data[1]?.genera?.find((entry) => entry.language.name === 'en');
  const varieties = data[1]?.varieties?.map((variety) => variety.pokemon.name).filter((name) => name !== data[0]?.name) ?? [];
  const eggGroups = data[1]?.egg_groups?.map((group) => group.name) ?? [];

  const completeData: CompletedPokemon = {
    abilities: data[0]?.abilities,
    base_experience: data[0].base_experience,
    base_happiness: data[1].base_happiness,
    capture_rate: data[1].capture_rate,
    cries: data[0]?.cries,
    egg_groups: eggGroups,
    evolution_chain: await getEvolutionChain(data[1]?.evolution_chain?.url ?? ''),
    flavor_text: englishFlavourText?.flavor_text,
    genus: englishGenusEntry?.genus,
    growth_rate: data[1].growth_rate.name,
    height: data[0]?.height,
    id: data[0].id,
    location_area_encounters: data[0].location_area_encounters,
    moves: data[0].moves,
    name: data[0].name,
    sprites: data[0].sprites,
    stats: data[0].stats,
    types: data[0].types,
    weight: data[0].weight,
    varieties: varieties
  }

  return completeData;
}
 
export default async function Page({params: {slug}}: {params: {slug: string}}) {
  const data: CompletedPokemon = await getData(slug)
  const {name, id, sprites, types, flavor_text, genus, height, weight, base_experience, base_happiness, capture_rate, growth_rate, location_area_encounters, abilities, stats, egg_groups, moves, evolution_chain, varieties} = data;

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
      <article className="stats">
      </article>
    </section>
    </main>
  )
}