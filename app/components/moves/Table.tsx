import { type FormattedMove } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function Table({type, moves, isLevelUp}: {type: string, moves: FormattedMove[], isLevelUp: boolean}) {
    return (
        <table className={type}>
            <caption>{type} moves</caption>
            <thead>
                <tr>
                    <th>Name</th>
                    {isLevelUp ? <th>Level</th> : null}
                    <th>Type</th>
                    <th>Category</th>
                    <th>Power</th>
                    <th>Accuracy (%)</th>
                </tr>
            </thead>
            <tbody>
                {moves.map((move, index) => 
                    <tr key={index}>
                        <td><Link href={`/move/${move.name}`}>{move.name}</Link></td>
                        {isLevelUp ? <td>{move.level}</td> : null}
                        <td><span className={`type type-${move.type}`}><Image src={`/types/${move.type}.webp`} alt={`${move.type} type`} width={48} height={42} />{move.type ?? '-'}</span></td>
                        <td>{move.category ?? '-'}</td>
                        <td>{move.power ?? '-'}</td>
                        <td>{move.accuracy ?? '-'}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}
