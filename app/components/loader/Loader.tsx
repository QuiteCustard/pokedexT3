import "@/components/loader/loader.css";
import Link from "next/link";

export default function Loading({noBackground, loadContent}: {noBackground?: boolean, loadContent?: string}) {
  return (
    <div id="loading-cover" className={`${noBackground ? 'no-bg' : ''}`}>
      <p className="pokedex-title">Loading {loadContent}...</p>
      <p>Still not loaded after a few seconds? Click <Link href={"/"}>here</Link></p>
    </div>
  )
}