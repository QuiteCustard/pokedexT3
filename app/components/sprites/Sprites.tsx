import Image from 'next/image'
import { type Sprites } from '@/types';
import React from 'react';

export default function Sprites({sprites, height, width, priority, tabbable}: {sprites: {src?: string | null, alt: string}[], name: string, height: number, width: number, priority?: boolean, tabbable?: boolean}) {
    return (
        <div className="sprites-wrapper" tabIndex={tabbable === true ? 0 : undefined}>
            {sprites.map(({src, alt}, index) => (
                <React.Fragment key={index}>
                    {src && <Image src={src} alt={alt} width={width} height={height} priority={priority} className='no-hide' />}
                </React.Fragment>
            ))} 
        </div>
    )
}
