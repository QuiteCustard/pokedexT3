"use client";
import "@/components/loader/loader.css";
import { loaderActive, pokedexGen } from "@/page";
import { useComputed, useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";

export default function Loading() {
  useSignals();

  return (
    <div id="loading-cover" className={loaderActive.value === true ? 'open' : ''}>
      <p>Loading...</p>
    </div>
  )
}
