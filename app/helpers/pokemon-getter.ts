import type {
  Chain,
  CompletedAbility,
  CompletedMove,
  CompletedPokemon,
  DetailedAbility,
  DetailedMove,
  DetailedPokemon,
  EvolutionChain,
  EvolutionChainData,
  EvolutionDetails,
  FilteredVariety,
  Sprites,
  Variety,
} from "@/types";
import { notFound } from "next/navigation";
import {
  keysToReplace,
  descriptionFormats,
  triggerFormats,
} from "./description-formats";

type Results = {
  name: string;
  id?: number;
  evolution_details: EvolutionDetails[];
  sprites?: Sprites;
};

export const baseURL = `https://pokeapi.co/api/v2/`;
export const pokemonURL = `pokemon`;
export const pokemonLimit = `?limit=21`;
export const speciesURL = `pokemon-species`;

export async function getIndividualPokemon(urls: string[]) {
  const controller = new AbortController();
  const signal = controller.signal;

  const data: DetailedPokemon[] = await Promise.all(
    urls.map(async (url) => {
      const response = await fetch(url, { signal });
      if (!response.ok) throw new Error("Critical error");
      const pokemonSpecies = (await response.json()) as DetailedPokemon;
      const monURL = pokemonSpecies.varieties?.[0]?.pokemon.url;
      if (!monURL) return { ...pokemonSpecies, url };
      const f = await fetch(monURL, { signal });
      const { sprites } = (await f.json()) as DetailedPokemon;
      const pokemonData = { ...pokemonSpecies, sprites } as DetailedPokemon;
      return pokemonData;
    })
  );

  return data;
}

async function getEvolutionChain(url: string) {
  const f = await fetch(url);

  if (!f) notFound();

  const data = (await f.json()) as EvolutionChainData;

  function extractEvolutionData(chain: Chain) {
    const result: Results[] = [];

    function traverse(node: Chain) {
      if (node.species) {
        const idMatch = node.species.url.match(/(\d+)\/?$/);
        const id = idMatch ? Number(idMatch[1]) : undefined;
        result.push({
          id: id,
          evolution_details: node.evolution_details,
          name: node.species.name,
        });
      }

      if (node.evolves_to.length > 0) node.evolves_to.forEach(traverse);
    }

    traverse(chain);

    return result;
  }

  const evolutionData = extractEvolutionData(data.chain);

  const evolutions = await Promise.all(
    evolutionData.map(async ({ name, evolution_details, id }) => {
      const details = evolution_details.map((mon) =>
        Object.fromEntries(Object.entries(mon).filter(([_, val]) => val))
      )

      const response = await fetch(`${baseURL}/${pokemonURL}/${id}`);
      if (!response.ok) return { name };

      const pokemonData = (await response.json()) as DetailedPokemon;

      return {
        name,
        id,
        sprites: {
          front_default: pokemonData.sprites.other?.["official-artwork"]?.front_default ?? pokemonData.sprites.other?.home?.front_default ?? pokemonData.sprites.front_default,
          front_shiny: pokemonData.sprites.other?.["official-artwork"]?.front_shiny ?? pokemonData.sprites.other?.home?.front_shiny ?? pokemonData.sprites.front_shiny,
        } as Sprites,
        ...(details.length > 0 && { evolution_details: details }),
      };
    })
  );

  return evolutions as EvolutionChain[];
}

export async function getVariationData(variety: Variety) {
  const matchResult = variety.pokemon.url.match(/(\d+)\/?$/);
  const id = matchResult ? Number(matchResult[1]) : undefined;

  if (id) {
    const data = await fetch(`${baseURL}/${pokemonURL}/${id}`);
    if (!data.ok) return { name: variety.pokemon.name, id } as FilteredVariety;
    const pokemonData = (await data.json()) as DetailedPokemon;

    return {
      name: variety.pokemon.name,
      id,
      sprites: {
        front_default: pokemonData.sprites.other?.["official-artwork"]?.front_default ?? pokemonData.sprites.other?.home?.front_default ?? pokemonData.sprites.front_default,
        front_shiny: pokemonData.sprites.other?.["official-artwork"]?.front_shiny ?? pokemonData.sprites.other?.home?.front_shiny ?? pokemonData.sprites.front_shiny,
      } as Sprites,
    } as FilteredVariety;
  }
}

export function getEvolutionDetail(detail: EvolutionDetails) {
  function formatValue<K extends keyof EvolutionDetails>(
    value: EvolutionDetails[K],
    key: K,
    detail: EvolutionDetails
  ) {
    if (typeof value === "object" && value !== null && "name" in value) {
      if (keysToReplace.includes(key.toString())) {
        const prefix =
          key === "known_move" &&
            detail.trigger &&
            ["agile-style-move", "strong-style-move"].includes(
              detail.trigger.name
            )
            ? "Master "
            : "";
        return `${prefix}${value.name.replace(/-/g, " ")}`;
      }
    } else if (typeof value === "boolean") {
      return value ? "" : null;
    }
    return value?.toString();
  }

  function generateDescription() {
    const descriptions = Object.entries(detail).reduce((acc, [key, value]) => {
      if (key !== "trigger" && descriptionFormats[key]) {
        const formattedValue = formatValue(value, key, detail);
        if (formattedValue !== null)
          acc.push(`${descriptionFormats[key]} ${formattedValue}`);
      }
      return acc;
    }, [] as string[]);

    let description = descriptions.join(", ");

    if (detail.trigger && triggerFormats[detail.trigger.name]) {
      if (detail.trigger.name === "use-item" && detail.item?.name) {
        description = `${triggerFormats[detail.trigger.name]
          } ${detail.item.name.replace(/-/g, " ")} ${description}`;
      } else if (
        !["agile-style-move", "strong-style-move"].includes(detail.trigger.name)
      ) {
        description = `${triggerFormats[detail.trigger.name]} ${description}`;
      }
    }

    return description;
  }

  return generateDescription();
}

export async function getPokemonData(slug: string, signal: AbortSignal) {
  const d = await fetch(`${baseURL}/${pokemonURL}/${slug}`, { signal });
  return (await d.json()) as DetailedPokemon;
}

export async function formatData(
  pokemonData: DetailedPokemon,
  speciesData: DetailedPokemon
) {
  const {
    id,
    abilities,
    base_experience,
    height,
    location_area_encounters,
    moves,
    name,
    sprites,
    stats,
    types,
    weight,
    cries,
  } = pokemonData;

  const englishFlavourText = [...(speciesData?.flavor_text_entries ?? [])].reverse().find((entry) => {
    const isLegendsArceus = entry.version?.name === "legends-arceus";
    const isHisui = name.toLowerCase().endsWith("-hisui");
    return entry.language.name === "en" && (isHisui || !isLegendsArceus);
  })

  const englishGenusEntry = speciesData?.genera?.find((entry) => entry.language.name === "en");

  const filteredVarieties = speciesData?.varieties?.map((variety) => variety.pokemon.name !== speciesData?.name ? getVariationData(variety) : undefined) ?? [];

  const eggGroups = speciesData?.egg_groups?.map((group) => group.name) ?? [];
  const evolutionChain = speciesData?.evolution_chain?.url ? await getEvolutionChain(speciesData?.evolution_chain?.url) : null;
  if (moves.length === 0) {
    const data = await fetch(`${baseURL}/${pokemonURL}/${speciesData?.id}`);
    const pokemonData = await data.json() as DetailedPokemon;
    moves.push(...pokemonData.moves);
  }

  const completeData: CompletedPokemon = {
    abilities: abilities,
    base_experience: base_experience,
    base_happiness: speciesData?.base_happiness,
    capture_rate: speciesData?.capture_rate,
    cries: cries,
    egg_groups: eggGroups,
    evolution_chain: evolutionChain ?? null,
    flavor_text: englishFlavourText?.flavor_text,
    genus: englishGenusEntry?.genus,
    growth_rate: speciesData?.growth_rate.name,
    height: height,
    id: speciesData?.id ?? id,
    location_area_encounters: location_area_encounters,
    moves: moves,
    name: name,
    sprites: {
      front_default: sprites.other?.["official-artwork"]?.front_default ?? sprites.other?.home?.front_default ?? sprites.front_default,
      front_shiny: sprites.other?.["official-artwork"]?.front_shiny ?? sprites.other?.home?.front_shiny ?? sprites.front_shiny,
    },
    stats: stats,
    types: types,
    weight: weight,
    varieties: await Promise.all(
      filteredVarieties.filter(
        (variety) => variety !== undefined
      ) as Promise<FilteredVariety>[]
    ),
  };

  return completeData;
}

export async function getPokemonPageData(slug: string) {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const data = await fetch(`${baseURL}/${speciesURL}/${slug}`, { signal });
    const speciesData = await data.json() as DetailedPokemon;
    let name = '';
    if (speciesData?.species?.name) {
      name = speciesData.species.name.toString();
    } else if (speciesData?.varieties?.[0]?.pokemon?.name) {
      name = speciesData.varieties[0].pokemon.name;
    }
    const pokemonData = await getPokemonData(name, signal);

    return await formatData(pokemonData, speciesData);
  } catch (error) {
    try {
      const pokemonData = await getPokemonData(slug.toString(), signal)
      const data = await fetch(`${baseURL}/${speciesURL}/${pokemonData.species.name.toLowerCase()}`, { signal });
      const speciesData = await data.json() as DetailedPokemon;
      return await formatData(pokemonData, speciesData);
    } catch (error) {
      console.log(error)
      notFound();
    }
  }
}

export async function getAbilityData(slug: string) {
  const controller = new AbortController();
  const signal = controller.signal;

  const data = await fetch(`${baseURL}/ability/${slug}`, { signal });
  const { effect_changes, effect_entries, flavor_text_entries, name, pokemon } = await data.json() as DetailedAbility;
  const englishFlavourText = [...(flavor_text_entries ?? [])].reverse().find((entry) => entry.language.name === "en");
  const englishEffectEntry = [...(effect_entries ?? [])].reverse().find((entry) => entry.language.name === "en");

  const pokemonData = await Promise.all(pokemon.map(async (poke) => {
    const response = await fetch(poke.pokemon.url, { signal });
    const { sprites } = await response.json() as DetailedPokemon;

    return {
      name: poke.pokemon.name,
      is_hidden: poke.is_hidden,
      sprites: {
        front_default: sprites.other?.["official-artwork"]?.front_default ?? sprites.other?.home?.front_default ?? sprites.front_default,
        front_shiny: sprites.other?.["official-artwork"]?.front_shiny ?? sprites.other?.home?.front_shiny ?? sprites.front_shiny,
      }
    }
  }))

  const ability: CompletedAbility = { effect_changes, effect_entries: englishEffectEntry?.effect, flavor_text: englishFlavourText?.flavor_text, name, pokemon: pokemonData }
  return ability;
}

export async function getMoveData(slug: string) {
  const controller = new AbortController();
  const signal = controller.signal;

  const data = await fetch(`${baseURL}move/${slug.replace(/%20/g, '-')}`, { signal });
  const { accuracy, contest_combos, damage_class, effect_entries, flavor_text_entries, learned_by_pokemon, meta, name, power, pp, priority, target, type } = await data.json() as DetailedMove;
  const englishFlavourText = [...(flavor_text_entries ?? [])].reverse().find((entry) => entry.language.name === "en");
  const pokemonData = await Promise.all(learned_by_pokemon.map(async (poke) => {
    const response = await fetch(poke.url, { signal });
    const { sprites } = await response.json() as DetailedPokemon;
    return {
      name: poke.name,
      sprites: {
        front_default: sprites.other?.["official-artwork"]?.front_default ?? sprites.other?.home?.front_default ?? sprites.front_default,
        front_shiny: sprites.other?.["official-artwork"]?.front_shiny ?? sprites.other?.home?.front_shiny ?? sprites.front_shiny,
      }
    }
  }))

  const move: CompletedMove = {
    flavor_text: englishFlavourText?.flavor_text, name,
    pokemon: pokemonData,
    accuracy,
    power,
    pp,
    type: type.name,
    contest_combos,
    effect_entries: effect_entries[0]?.effect,
    meta,
    priority,
    target: target.name,
    damage_class: damage_class?.name
  }

  return move;
}