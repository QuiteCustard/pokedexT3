import { type FormattedMove } from "@/types";

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
                        <td>{move.name}</td>
                        {isLevelUp ? <td>{move.level}</td> : null}
                        <td><span className={`type type-${move.type}`}>{move.type ?? '-'}</span></td>
                        <td>{move.category ?? '-'}</td>
                        <td>{move.power ?? '-'}</td>
                        <td>{move.accuracy ?? '-'}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}
