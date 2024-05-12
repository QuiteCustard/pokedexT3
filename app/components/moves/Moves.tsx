import type { FormattedMove, Move, MoveData } from "@/types"

function renderTable(moves: FormattedMove[], isLevelUp: boolean, type: string) {
    return <table className={type}>
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
}

async function getMoveData(moves: Move[]) {
    const data = Promise.all(moves.map(async move => {
        const {move: {name}, version_group_details: [versionDetails]} = move;
        const response = await fetch(move.move.url);
        const {accuracy, damage_class: {name: category}, power, type: {name: type}} = await response.json() as MoveData;
        return {name: name.replace(/-/g, ' '), accuracy, category, power, learnMethod: versionDetails?.move_learn_method.name, type, method: "", level: versionDetails?.level_learned_at} as FormattedMove;
    }))

    return data;
}

export default async function Moves({moves}: {moves: Move[]} ) {
    console.log(moves[1]?.version_group_details[0]?.version_group)
    const formattedMoves = await getMoveData(moves)
    const levelUpMoves = formattedMoves.filter(move => move.learnMethod === 'level-up');
    const machineMoves = formattedMoves.filter(move => move.learnMethod === 'machine');
    const eggMoves = formattedMoves.filter(move => move.learnMethod === 'egg');

    return (
        <section className="moves">
            <article>
                <h2>Moves</h2>
                <div className="tables">
                    {renderTable(levelUpMoves, true, "level")}
                    {renderTable(machineMoves, false, "machine")}
                    {renderTable(eggMoves, false, "egg")}
                </div>
            </article>
        </section>
    )
}
