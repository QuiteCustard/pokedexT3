"use client";
import "@/components/loader/loader.css";
import { signal } from "@preact/signals-react";

import { useSignals } from "@preact/signals-react/runtime";

export const loaderActive = signal(true);

export default function Loading() {
  useSignals();

  return (
    <div id="loading-cover" className={loaderActive.value === true ? 'open' : ''}>
      <p className="pokedex-title">Loading...</p>
    </div>
  )
}
