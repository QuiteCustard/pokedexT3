"use client";

import type { Data } from "@/types";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import Link from "next/link";
import { type ChangeEvent } from "react";

const filteredList = signal<Data[]>([]);

export default function Form({data}: {data: Data[]}) {
	useSignals();

	function filterSearch(event: ChangeEvent<HTMLInputElement>) {
		const search = event.target.value.toLowerCase();
		if (search === "") return filteredList.value = [];
		const uniqueData = Array.from(new Set(data.map(dt => dt.name))).map(name => data.find(dt => dt.name === name))
		const filtered = uniqueData.filter(dt => dt?.name.includes(search));
		if (filtered.length > 0) filteredList.value = filtered as Data[];
	}

	return (
		<div className="search-wrapper">
			<input type="text" placeholder="Search" onChange={(event) => filterSearch(event)} onFocus={(event) => filterSearch(event)} />
			<div className="search">
				{filteredList.value.map(dt => (
					<Link href={`/${dt.type}/${dt.name}`} key={dt.name} onClick={() => filteredList.value = []}>{dt.name}</Link>
				))}
			</div>
		</div>
	)
}