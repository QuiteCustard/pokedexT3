"use client";
import { setCookie } from "@/helpers/set-theme";
import { GENS, type genValues, pokedexGen } from "@/page";
import { useSignals } from "@preact/signals-react/runtime";

export default function PokedexGenChanger({theme}: {theme: genValues}) {
  useSignals();

  async function changeTheme() {
    pokedexGen.value === GENS.gen9 ? pokedexGen.value = GENS.gen4 : pokedexGen.value = GENS.gen9;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- Not a misused promise
    setTimeout(async () => await setCookie(pokedexGen.value), 800)
  }

  return (
    <button onClick={() => changeTheme()} className="button">{theme}</button>
  )
}