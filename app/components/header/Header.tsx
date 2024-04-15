import Image from "next/image";
import "@/components/header/header.css";
import PokedexGenChanger from "./pokedex-gen-changer/PokedexGenChanger";
import { cookies } from "next/headers";
import type { genValues } from "@/page";

export default function Header() {
  return (
    <header>
      <Image src={"/logo.png"} alt="Logo" height="75" width="75" />
      <h1>Pokédex</h1>
      <PokedexGenChanger defaultTheme={cookies().get('theme')?.value as genValues} />
    </header>
  )
}