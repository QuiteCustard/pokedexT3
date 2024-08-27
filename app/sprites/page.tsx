import Sprites from "@/components/sprites/Sprites"
import { baseURL, pokemonURL } from "@/helpers/pokemon-getter"
import type { ApiGroupData, CompletedPokemon } from "@/types"

export default async function page() {
    const poke = baseURL + pokemonURL + "?limit=10000000"

    const d = await fetch(poke)
    if (!d.ok) throw new Error("Failed to fetch data")
    const { results } = await d.json() as ApiGroupData

    const resolved = await Promise.all(results.map(async ({ url }) => {
        const data = await fetch(url)
        if (!data.ok) throw new Error("Failed to fetch data")
        const { sprites: { other } } = await data.json() as CompletedPokemon
        const official = other?.["official-artwork"]
        return official
    }))

    return (
        <main className="list">
            {resolved.map((sprites, i) => (
                <div className="pokemon-img-wrapper" key={i}>
                    <Sprites sprites={[{ src: sprites?.front_default, alt: '' }, { src: sprites?.front_shiny, alt: '' }]} name={""} height={100} width={100} />
                </div>
            ))}
        </main>
    )
}