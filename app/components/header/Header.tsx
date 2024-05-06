import Image from "next/image";
import "@/components/header/header.css";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <Link href="/"><Image src={"/logo.png"} alt="Logo" height="75" width="75" /></Link>
      <h1 className="pokedex-title">Pokédex</h1>
    </header>
  )
}