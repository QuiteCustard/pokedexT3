import type { FormattedLocation, LocalisedLocation, Location } from "@/types"

async function getLocationData(location: string) {
    const controller = new AbortController();
    const signal = controller.signal;   
    const response = await fetch(location, {signal})
    const data = await response.json() as Location[];

    const locations = await Promise.all(data.map(async (location) => {
        const f = await fetch(location.location_area.url, {signal})
        const {location: {name}} = await f.json() as LocalisedLocation;
        return { name, version_details: location.version_details  } as FormattedLocation;
    }))

    return locations;
}

export default async function Locations({location}: {location: string}) {
    const locationData = await getLocationData(location)
    return (
        <>
         {locationData.length > 0 ?
            <section className="locations">
                <article>
                    <h2>Locations</h2>
                    <table>
                        <caption>Where to find this Pokémon</caption>
                        <thead>
                            <tr>
                                <th>Game</th>
                                <th>Area</th>
                                <th>Chance</th>
                                <th>Min Level</th>
                                <th>Max Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locationData.map((location, index) => (
                                <tr key={index}>
                                    <td>{location.version_details[0]?.version.name}</td>
                                    <td>{location.name.replace(/-/g, ' ')}</td>
                                    <td>{location.version_details[0]?.max_chance}</td>
                                    <td>{location.version_details[0]?.encounter_details[0]?.min_level}</td>
                                    <td>{location.version_details[0]?.encounter_details[0]?.max_level}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </article>
            </section>
        : null}
        </>
    )
}
