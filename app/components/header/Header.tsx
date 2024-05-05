import Image from "next/image";
import "@/components/header/header.css";

export default function Header() {
  return (
    <header>
      <Image src={"/logo.png"} alt="Logo" height="75" width="75" />
      <h1>Pokédex</h1>
    </header>
  )
}