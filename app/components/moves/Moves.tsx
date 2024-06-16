import type { EvolutionChain, FormattedMove, Move, MoveData } from "@/types";
import { getPokemonData } from "@/helpers/pokemon-getter";
import Table from "./Table";

async function getMoveData(moves: Move[]) {
    const data = await Promise.all(moves.map(async move => {
        const {move: {name}, version_group_details} = move;
        const response = await fetch(move.move.url);
        if (!response.ok) return;
        const {accuracy, damage_class: {name: category}, power, type: {name: type}} = await response.json() as MoveData;
        const count = version_group_details?.length - 1;
        return {name: name.replace(/-/g, ' '), accuracy, category, power, learnMethod: version_group_details[count]?.move_learn_method.name, type, method: "", level: version_group_details[count]?.level_learned_at} as FormattedMove;
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
        <>
            {(levelUpMoves && levelUpMoves.length > 0) ?? (machineMoves && machineMoves.length > 0) ?? (eggMoves && eggMoves.length > 0) ? 
            <section className="moves">
                <article>
                    <h2>Moves</h2>
                    <div className="tables"> 
                        {levelUpMoves && machineMoves.length > 0 && <Table type="level-up" moves={levelUpMoves} isLevelUp={true} /> }
                        {machineMoves && machineMoves.length > 0 && <Table type="machine" moves={machineMoves} isLevelUp={false} />}
                        {eggMoves && eggMoves.length > 0 && <Table type="egg" moves={eggMoves} isLevelUp={false} />}
                    </div>
                </article>
            </section> : null}
        </>
    )
}