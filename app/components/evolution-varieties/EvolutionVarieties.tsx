import { getEvolutionDetail } from "@/helpers/pokemon-getter";
import type { EvolutionVarieties } from "@/types";
import Link from "next/link";
import Image from "next/image";

export default function EvolutionVarieties({
  evolution_chain,
  varieties,
  sprites,
}: EvolutionVarieties) {
  return (
    <section className="evolution-varieties">
      <article>
        {evolution_chain && evolution_chain.length > 0 ? (
            <section className="evolution-chain">
            <h2>Evolution Chain</h2>
            <ul>
              {evolution_chain?.map((evolution, index) => (
                <li key={index}>
                  <article>
                    <Link href={`/pokemon/${evolution.name}`}>
                      <div className="img-wrapper">
                        <Image
                          src={
                            evolution.sprite ??
                            sprites.other.home.front_default ??
                            sprites.front_default
                          }
                          alt={`${evolution.name} sprite`}
                          width={100}
                          height={100}
                        />
                      </div>
                    </Link>
                    <h3>{evolution.name}</h3>
                    {evolution.evolution_details?.map((detail, index) => (
                      <p key={index}>{getEvolutionDetail(detail)}</p>
                    ))}
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {varieties && varieties?.length > 0 ? (
          <section className="varieties">
            <h2>Other Varieties</h2>
            <ul>
              {varieties.map((variety, index) => (
                <li key={index}>
                  <article key={index}>
                    <Link href={`/pokemon/${variety.id}`}>
                      <div className="img-wrapper">
                        <Image
                          src={variety.sprite ?? sprites.front_default}
                          alt={`${variety.name} sprite`}
                          width={100}
                          height={100}
                        />
                      </div>
                      <h3>{variety.name}</h3>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </section>
  );
}
