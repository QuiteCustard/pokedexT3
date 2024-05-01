import Image from "next/image";
import "@/components/header/header.css";
import PokedexGenChanger from "./pokedex-gen-changer/PokedexGenChanger";
import { type genValues } from "@/types";

export default function Header({theme}: {theme: genValues}) {
  return (
    <header>
      <Image src={"/logo.png"} alt="Logo" height="75" width="75" />
      <h1>Pokédex</h1>
      <PokedexGenChanger theme={theme}/>
    </header>
  )
}