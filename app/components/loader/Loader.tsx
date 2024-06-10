import "@/components/loader/loader.css";
import Link from "next/link";

export default function Loading() {
  return (
    <div id="loading-cover" className={'open'}>
      <p className="pokedex-title">Loading...</p>
      <p>Still not loaded after a few seconds? Click <Link href={"/"}>here</Link></p>
    </div>
  )
}
