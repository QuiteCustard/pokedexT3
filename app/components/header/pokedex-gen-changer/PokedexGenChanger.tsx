"use client";
import { setTheme } from "@/helpers/set-theme";
import { loaderActive, pokedexGen } from "@/page";
import { GENS, type genValues} from "@/types";
import { useSignals } from "@preact/signals-react/runtime";

export default function PokedexGenChanger({theme}: {theme:genValues}) {
  useSignals();

  async function changeTheme() {
    pokedexGen.value === GENS.gen9 ? pokedexGen.value = GENS.gen4 : pokedexGen.value = GENS.gen9;
    loaderActive.value = true;

    setTimeout(() => { 
      setTheme(pokedexGen.value).catch(console.error);

      setTimeout(() => {
        loaderActive.value = false;
      }, 100)
    }, 800)
  }

  return (
    <button onClick={() => changeTheme()} className="button">{theme}</button>
  )
}