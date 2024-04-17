"use client";
import "@/components/loader/loader.css";
import { pokedexGen } from "@/page";
import { useComputed, useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";

export default function Loading() {
  useSignals();
  const open = useSignal(false);
  const update = useComputed(() => `${pokedexGen.value}`);
  useSignalEffect(() => getState(update.value))

  function getState(value: string) {
    open.value = true;
    setTimeout(() => open.value = false, 1000)
  }

  return (
    <div id="loading-cover" className={open.value === true ? 'open' : ''}>
      <p>Loading...</p>
    </div>
  )
}
