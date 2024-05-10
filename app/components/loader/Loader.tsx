"use client";
import "@/components/loader/loader.css";
import { loaderActive } from "@/page";
import { useSignals } from "@preact/signals-react/runtime";

export default function Loading() {
  useSignals();

  return (
    <div id="loading-cover" className={loaderActive.value === true ? 'open' : ''}>
      <p className="pokedex-title">Loading...</p>
    </div>
  )
}
