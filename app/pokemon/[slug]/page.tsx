import { pokemonURL } from "@/helpers/pokemon-getter";
import type { DetailedPokemon } from "@/types";
import "@/pokemon/pokemon.css";

async function getData(slug: string) {
  const data = await fetch(`${pokemonURL}/${slug}`);

  if (!data.ok) throw new Error('Critical error');
  return await data.json() as DetailedPokemon;
}
 
export default async function Page({params: {slug}}: {params: {slug: string}}) {
  const data: DetailedPokemon = await getData(slug);
  const {name, id, sprites, types} = data;
  console.log(data)

  return (
    <main>
      <section className="details">
        <div>
          <h1>{name}</h1>
          <h2>No. {id}</h2>
        </div>
        <ul className="types">
          {types.map((type, index) => <li key={index} className={`type-${type.type.name}`}>{type.type.name}</li>)}
        </ul>
      </section>
    </main>
  )
}