import "@/pokemon/pokemon.css";
import BasicInfo from "@/components/basic-info/BasicInfo";
import AdvancedInfo from "@/components/advanced-info/AdvancedInfo";

export default async function page() {
    const types = [{slot: 0,type: {name: "normal",url: "none"}}, {slot: 1,type: {name: "bird",url: "none"},}]
    const sprites = {
        front_default: "none",
        front_shiny: "none",
        other: {
            home: {
                front_default: "/MissingNo.png",
                front_shiny: "/MissingNo.png"
            }
        }
    }
    const stats = [
        {base_stat: 36, effort: 0, stat: {name: "hp", url: "none"}},
        {base_stat: 136, effort: 0, stat: {name: "attack", url: "none"}},
        {base_stat: 0, effort: 0, stat: {name: "defense", url: "none"}},
        {base_stat: 6, effort: 0, stat: {name: "special-attack", url: "none"}},
        {base_stat: 6, effort: 0, stat: {name: "special-defense", url: "none"}},
        {base_stat: 29, effort: 0, stat: {name: "speed", url: "none"}}
    ]

    const abilities = [
        {ability: {name: "Corrupt images on your save", url: "none"}, is_hidden: false, slot: 0},
        {ability: {name: "Cause your game to crash", url: "none"}, is_hidden: true, slot: 1},
    ]
    
    return (
        <main>
            <BasicInfo name={"MissingNo."} id={0} genus={"The missing number pokémon"} types={types} flavor_text={"As an anomaly, it thrives on the glitches and errors within the game's code, morphing and changing its form. Its existence is a testament to the unpredictable nature of the digital world."} sprites={sprites} height={10} weight={99} />
            <AdvancedInfo base_experience={0} base_happiness={0} capture_rate={29} growth_rate={"?"} abilities={abilities} stats={stats} />
        </main>
    )
}
