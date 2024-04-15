"use client";
import { setCookie } from "@/helpers/setTheme";
import { GENS, type genValues, pokedexGen } from "@/page";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { useEffect } from "react";

export default function PokedexGenChanger({defaultTheme}: {defaultTheme: genValues}) {
  useSignals();

  useEffect(() => {
    pokedexGen.value = document.body.dataset.theme?.slice(3) as genValues ?? '9'
  }, [])

  useSignalEffect(() => {
    setTimeout(() => document.body.dataset.theme = `gen${pokedexGen.value}`, 800) 
  })

  async function changeTheme() {
    pokedexGen.value === GENS.gen9 ? pokedexGen.value = GENS.gen4 : pokedexGen.value = GENS.gen9;
    await setCookie(pokedexGen.value);
  }

  return (
    <button onClick={() => changeTheme()} className="button">Gen: {defaultTheme}</button>
  )
}