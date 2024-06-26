export type Image = {
    height: number,
    width: number,
    alt: string,
    src: string
}

export type Data = {
    name: string,
    url: string
    type?: string
}

export type ApiGroupData = {
    results: Data[],
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

export type Cries = {
    latest: string,
    legacy: string
}

export type Sprites = {
    front_default: string,
    front_shiny: string,
    other: {
        home: {
            front_default: string,
            front_shiny: string,
        }
    }
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

export type Variety = {
    is_default: boolean,
    pokemon: {
        name: string,
        url: string
    }
}

export type FilteredVariety = {
    name: string,
    id: number,
    sprites: Sprites
}

export type EvolutionChain = {
    name: string,
    id: number,
    sprites: Sprites,
    evolution_details: EvolutionDetails[]
}

type GrowthRate = {
    name: string,
    url: string
}

export type VersionGroupDetails =  {
    level_learned_at: number,
    move_learn_method: {
        name: string,
        url: string
    },
    version_group: {
        name: string,
        url: string
    }
}

export type Move = {
    move: {
        name: string,
        url: string,
    },
    version_group_details: VersionGroupDetails[]
}

export type MoveData = {
    accuracy: number,
    damage_class: {
        name: string,
        url: string
    },
    name: string,
    power: number,
    pp: number,
    meta: {
        crit_rate: number,
    },
    type: {
        name: string,
        url: string
    }
}

export type FormattedMove = {
    name: string,
    method: string,
    level?: number,
    accuracy: number,
    category: string,
    power: number,
    type: string,
    learnMethod: string
}

export type DetailedPokemon = {
    abilities: Ability[]
    base_experience: number,
    base_happiness: number,
    capture_rate: number,
    cries: Cries,
    egg_groups: EggGroup[],
    evolution_chain?: {
        url: string
    },
    genera?: Genus[],
    growth_rate: GrowthRate,
    height: number,
    weight: number,
    moves: Move[],
    name: string,
    id: number,
    sprites: Sprites,
    stats: [],
    types: PokemonType[],
    flavor_text_entries?: FlavorTextEntry[],
    flavor_text?: string,
    location_area_encounters: string,
    varieties?: Variety[],
    species: {
        name: string,
        url: string,
    }
}

export type Stat = {
    base_stat: number,
    effort: number,
    stat: {
        name: string,
        url: string
    }
}

export type LocalisedLocation = {
    location: {
        name: string,
        url: string
    }
}

export type Location = {
    location_area: {
        name: string,
        url: string
    },
    version_details: VersionDetails[]
}

export type EncounterDetails = {
    chance: number,
    condition_values: { name: string; url: string }[],
    max_level: number,
    min_level: number
}

export type VersionDetails = {
    encounter_details: EncounterDetails[],
    max_chance: number,
    version: {
        name: string,
        url: string
    }
}

export type FormattedLocation = {
    name: string,
    version_details: VersionDetails[]
}

export type CompletedPokemon = {
    abilities: Ability[],
    base_experience: number,
    base_happiness?: number,
    capture_rate?: number,
    cries: Cries,
    egg_groups?: string[],
    evolution_chain?: EvolutionChain[] | null,
    flavor_text?: string,
    genus?: string,
    growth_rate?: string,
    height: number,
    id: number,
    location_area_encounters: string,
    moves: Move[],
    name: string,
    sprites: Sprites,
    stats: Stat[],
    types: PokemonType[],
    weight: number,
    varieties?: FilteredVariety[],
    species?: string
}

export type BasicInfo = {
    name: string,
    id: number,
    genus?: string,
    types: PokemonType[],
    flavor_text?: string,
    sprites: Sprites,
    height: number,
    weight: number,
    cries?: Cries
}

export type AdvancedInfo = {
    abilities: Ability[],
    base_experience?: number,
    base_happiness?: number,
    capture_rate?: number,
    egg_groups?: string[],
    flavor_text?: string,
    genus?: string,
    growth_rate?: string,
    stats: Stat[],
}

export type EvolutionVarieties = {
    evolution_chain?: EvolutionChain[] | null,
    varieties?: FilteredVariety[],
    sprites?: Sprites
}

export type PokemonArticle = {
    sprites: Sprites,
    name: string,
    id: number
}

export type NameUrlPair = {
    name: string,
    url: string
}

export type EvolutionDetails = {
    [key: string]: string | number | boolean | NameUrlPair | null | undefined;
    gender?: number | null,
    held_item?: null | NameUrlPair,
    item?: null | NameUrlPair,
    known_move?: null | NameUrlPair,
    known_move_type?: null | NameUrlPair,
    location?: null | NameUrlPair,
    min_affection?: null,
    min_beauty?: null,
    min_happiness?: number | null,
    min_level?: number | null,
    needs_overworld_rain?: boolean | null,
    party_species?: null | NameUrlPair,
    party_type?: null,
    relative_physical_stats?: number | null,
    time_of_day?: string | null,
    trade_species?: null | NameUrlPair,
    trigger?: NameUrlPair | null,
    turn_upside_down?: boolean | null
}

export type Chain = {
    evolution_details: EvolutionDetails[],
    evolves_to: Chain[],
    is_baby: boolean,
    species: {
        name: string,
        url: string
    }
}

export type EvolutionChainData = {
    baby_trigger_item: string | null,
    chain: Chain,
    id: number
}

export type DescriptionFormats = Record<string, string>;

export type TriggerFormats = Record<string, string>;
  
export interface Detail {
    trigger?: {
        name: string;
    };
    item?: {
        name: string;
    };
}

export interface Value {
    name?: string;
}

export type DetailedAbility = {
    effect_changes: [];
    effect_entries: {
        effect: string;
        language: NameUrlPair
    }[],
    flavor_text_entries?: FlavorTextEntry[],
    flavor_text?: string,
    generation: NameUrlPair,
    id: number,
    name: string,
    pokemon: {
        is_hidden: boolean,
        pokemon: NameUrlPair,
    }[]
}

export type CompletedAbility = {
    effect_changes: [],
    effect_entries?: string,
    flavor_text?: string,
    name: string,
    pokemon: {
        is_hidden: boolean,
        name: string
        sprites: Sprites
    }[]
}

type ContestComboDetail = {
    use_after: NameUrlPair[] | null,
    use_before: NameUrlPair[] | null
}

type contest_combos = {
    normal: ContestComboDetail,
    super: ContestComboDetail
}

type MoveMeta = {
    ailment: NameUrlPair,
    ailment_chance: number,
    category: NameUrlPair,
    crit_rate: number,
    drain: number,
    flinch_chance: number,
    healing: number,
    max_hits: number | null,
    max_turns: number | null,
    min_hits: number | null,
    min_turns: number | null,
    stat_chance: number
}
type Machine = {
    machine: NameUrlPair,
    version_group: NameUrlPair
}

export type DetailedMove = {
    accuracy: number | null,
    contest_combos: contest_combos | null,
    contest_effect: {url: string} | null,
    contest_type: NameUrlPair | null,
    damage_class: NameUrlPair,
    effect_chance: number | null,
    effect_changes: [],
    effect_entries: {
        effect: string,
        language: NameUrlPair,
        short_effect: string
    }[],
    flavor_text_entries: FlavorTextEntry[],
    generation: NameUrlPair,
    id: number,
    learned_by_pokemon: NameUrlPair[],
    machines: Machine[],
    meta: MoveMeta,
    name: string,
    past_values: [],
    power: number | null,
    pp: number,
    priority: number,
    stat_changes: [],
    super_contest_effect: null,
    target: NameUrlPair,
    type: NameUrlPair,
}

export type CompletedMove = {
    accuracy: number | null,
    contest_combos: contest_combos | null,
    contest_type?: string,
    damage_class?: string,
    effect_entries?: string,
    flavor_text?: string,
    name: string,
    pokemon: {
        name: string
        sprites: Sprites
    }[],
    meta: MoveMeta,
    power: number | null,
    pp: number,
    priority: number,
    target: string
    type: string
}