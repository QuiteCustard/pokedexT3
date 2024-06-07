import Image from 'next/image'
import { type Sprites } from '@/types';

export default function Sprites({sprites, height, width, priority, tabbable}: {sprites: {src: string, alt: string}[], name: string, height: number, width: number, priority?: boolean, tabbable?: boolean}) {
    return (
        <div className="sprites-wrapper" tabIndex={tabbable === true ? 0 : undefined}>
            {sprites.map((sprite, index) => (
                <Image key={index} src={sprite.src} alt={sprite.alt} width={width} height={height} priority={priority} />
            ))} 
        </div>
    )
}
