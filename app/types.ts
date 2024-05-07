export type Image = {
    height: number,
    width: number,
    alt: string,
    src: string
}

type Pokemon = {
    name: string,
    url: string
}

export type PokemonList = {
    results: Pokemon[],
    next: string,
    count: number
}

type Ability = {
    ability: {
        name: string,
        url: string,
    }
    is_hidden: boolean,
    slot: number
}

type Cries = {
    latest: string,
    legacy: string
}

type ArtworkSprite = {
    front_default: string | null;
    front_shiny: string | null;
}
  
type ShowdownSprite = {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

type DreamWorldSprite = {
    front_default: string | null;
    front_female: string | null;
}

type HomeSprite = {
    front_default: string | null,
    front_female: string | null,
    front_shiny: string | null,
    front_shiny_female: string | null,
}

type OtherSprites = {
    dream_world: DreamWorldSprite;
    home: HomeSprite;
    'official-artwork': ArtworkSprite;
    showdown: ShowdownSprite;
}

export type Sprites = {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other: OtherSprites
}

type PokemonType = {
    slot: number,
    type: {
        name: string,
        url: string
    }
}

type FlavorTextEntry = {
    flavor_text: string,
    language: {
        name: string,
        url: string
    },
    version: {
        name: string,
        url: string
    }
}

type EggGroup = {
    name: string,
    url: string
}

type Genus = {
    genus: string,
    language: {
        name: string,
        url: string
    }
}

type Variety = {
    is_default: boolean,
    pokemon: {
        name: string,
        url: string
    }
}

type EvolutionChain = {
    url: string
}

type GrowthRate = {
    name: string,
    url: string
}

export type DetailedPokemon = {
    abilities: Ability[]
    base_experience: number,
    base_happiness: number,
    capture_rate: number,
    cries: Cries,
    egg_groups: EggGroup[],
    evolution_chain?: EvolutionChain,
    genera?: Genus[],
    growth_rate: GrowthRate,
    height: number,
    weight: number,
    moves: [],
    name: string,
    id: number,
    sprites: Sprites,
    stats: [],
    types: PokemonType[],
    flavor_text_entries?: FlavorTextEntry[],
    flavor_text?: string,
    location_area_encounters: string,
    varieties: Variety[],
}

export type CompletedPokemon = {
    abilities: Ability[],
    base_experience: number,
    base_happiness: number,
    capture_rate: number,
    cries: Cries,
    egg_groups: string[],
    evolution_chain?: string[],
    flavor_text?: string,
    genus?: string,
    growth_rate: string,
    height: number,
    id: number,
    location_area_encounters: string,
    moves: [],
    name: string,
    sprites: Sprites,
    stats: [],
    types: PokemonType[],
    weight: number,
    varieties: string[]
}

export type PokemonArticle = {
    sprites: Sprites,
    name: string,
    id: number
}