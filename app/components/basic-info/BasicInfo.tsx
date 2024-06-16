import type { BasicInfo } from "@/types";
import Image from "next/image";
import Sprites from "../sprites/Sprites";

export default function BasicInfo({name, id, genus, types, flavor_text, sprites, height, weight, cries}: BasicInfo) {
	return (
		<section className="basic-info">
			<article>
				<section className="details">
					<div>
						<h1>{name}</h1>
						<h2>No. {id}</h2>
					</div>
					<p>{genus}</p>
					<ul className="types">
						{types.map((type, index) => (
							<li key={index} className={`type type-${type.type.name}`}>
								<Image src={`/types/${type.type.name}.webp`} alt={`${type.type.name} type`} width={48} height={42} />
								{type.type.name}
							</li>
						))}
					</ul>
				</section>
				<section className="flavour-text">
					<p>{flavor_text}</p>
					{cries.legacy ?? cries.legacy ? 
						<div>
							<audio controls>
								{cries.latest ? <source src={cries.latest} type="audio/ogg" /> : null}
								{cries.legacy ? <source src={cries.legacy} type="audio/ogg" /> : null}
							</audio>
						</div>
					: null}
				</section>
				<section className="main-sprite">
					<Sprites sprites={[{src: sprites.other.home.front_default, alt: `${name} sprite`}, {src: sprites.other.home.front_shiny, alt: `${name} shiny sprite`}]} name={name} height={512} width={512} priority={true} tabbable={true} />
				</section>
				<section className="attributes">
					<div>
						<h3>Height</h3>
						<p>{height / 10} meter{height / 10 > 1 || height / 10 < 1 ? "s" : ""}</p>
					</div>
					<div>
						<h3>Weight</h3>
						<p>{weight / 10} Kilograms</p>
					</div>
				</section>
			</article>
		</section>
	)
}
