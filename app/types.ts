export type Image = {
    height: number,
    width: number,
    alt: string,
    src: string
}

export type Pokemon = {
    name: string,
    url: string
}

export type PokemonList = {
    results: Pokemon[],
    next: string,
    count: number
}

export type Ability = {
    ability: {
        name: string,
        url: string,
    }
    is_hidden: boolean,
    slot: number
}

export type Cries = {
    latest: string,
    legacy: string
}

export type Form = {
    name: string,
    url: string
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

export type OtherSprites = {
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

export type PokemonType = {
    slot: number,
    type: {
        name: string,
        url: string
    }
}

export type DetailedPokemon = {
    abilities: Ability[]
    baseExperience: number,
    cries: Cries,
    forms: Form[],
    height: number,
    weight: number,
    moves: [],
    name: string,
    id: number,
    sprites: Sprites,
    types: PokemonType[],
    url: string
}

export type PokemonSlide = {
    sprites: Sprites,
    name: string,
    id: number
}