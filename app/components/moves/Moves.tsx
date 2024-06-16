import type { EvolutionChain, FormattedMove, Move, MoveData } from "@/types";
import { getPokemonData } from "@/helpers/pokemon-getter";
import { Suspense } from "react";
import Loading from "../loader/Loader";

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
    const data = await Promise.all(moves.map(async move => {
        const {move: {name}, version_group_details: [versionDetails]} = move;
        const response = await fetch(move.move.url);
        if (!response.ok) return;
        const {accuracy, damage_class: {name: category}, power, type: {name: type}} = await response.json() as MoveData;
        
        return {name: name.replace(/-/g, ' '), accuracy, category, power, learnMethod: versionDetails?.move_learn_method.name, type, method: "", level: versionDetails?.level_learned_at} as FormattedMove;
        }))

    return data.filter(move => move !== undefined);
}

export default async function Moves({moves, evolutions}: {moves: Move[], evolutions: EvolutionChain[]} ) {
    const formattedMoves = await getMoveData(moves)
    const levelUpMoves = formattedMoves.filter(move => move?.learnMethod === 'level-up') as FormattedMove[];
    const machineMoves = formattedMoves.filter(move => move?.learnMethod === 'machine') as FormattedMove[];
    const eggMoves = formattedMoves.filter(move => move?.learnMethod === 'egg') as FormattedMove[];

    if (eggMoves.length === 0 && evolutions.length > 0) {
        const controller = new AbortController();
		const signal = controller.signal;
        
        if (evolutions[0]?.name) {
            const {moves} = await getPokemonData(evolutions[0].name, signal)
            const  evoFormattedMoves = await getMoveData(moves)
            const evoEggMoves = evoFormattedMoves.filter(move => move?.learnMethod === 'egg') as FormattedMove[];
            eggMoves.push(...evoEggMoves)
        }
    }

    return (
        <Suspense fallback={<p>Moves loading</p>}>
            {(levelUpMoves && levelUpMoves.length > 0) ?? (machineMoves && machineMoves.length > 0) ?? (eggMoves && eggMoves.length > 0) ? <section className="moves">
                <article>
                    <h2>Moves</h2>
                    <div className="tables"> 
                        {levelUpMoves && machineMoves.length > 0 && renderTable(levelUpMoves, true, "level")}
                        {machineMoves && machineMoves.length > 0 && renderTable(machineMoves, false, "machine")}
                        {eggMoves && eggMoves.length > 0 && renderTable(eggMoves, false, "egg")}
                    </div>
                </article>
            </section> : null}
        </Suspense>
    )
}