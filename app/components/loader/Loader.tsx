"use client";
import "@/components/loader/loader.css";
import { pokedexGen } from "@/page";
import { useComputed, useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { useEffect, useState } from "react";

export default function Loading() {
  useSignals();
  const [init, setInit] = useState(false)
  const open = useSignal(false);
  const update = useComputed(() => `${pokedexGen.value}`);
  useSignalEffect(() => getState(update.value))

  function getState(value: string) {
    if (init === false) return;
    open.value = true;
    setTimeout(() => open.value = false, 800)
  }

  useEffect(() => {
    setInit(true)
  }, [init])
  
  return (
    <div id="loading-cover" className={open.value === true ? 'open' : ''}>
      <p>Loading...</p>
    </div>
  )
}
