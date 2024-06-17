"use client";

import { type Pokemon } from "@/types";
import { signal } from "@preact/signals-react";
import { useComputed, useSignals } from "@preact/signals-react/runtime";
import Link from "next/link";
import { type ChangeEvent } from "react";
const filteredList = signal<Pokemon[]>([]);

export default function Form({pokemon}: {pokemon: Pokemon[]}) {
  useSignals();

  function filterSearch(event: ChangeEvent<HTMLInputElement>) {
    const search = event.target.value.toLowerCase();
    const filteredPokemon = pokemon.filter(pokemon => pokemon.name.includes(search));
    if (search === "") filteredList.value = [];
    else filteredList.value = filteredPokemon
  }

  return (
    <div className="search-wrapper">
      <input type="text" placeholder="Search" onChange={(event) => filterSearch(event)} />
      <div className="search">
        {filteredList.value.map(pokemon => (
          <Link href={`/pokemon/${pokemon.name}`} key={pokemon.name} onClick={() => filteredList.value = []}>{pokemon.name}</Link>
        ))}
      </div>
      </div>
  )
}