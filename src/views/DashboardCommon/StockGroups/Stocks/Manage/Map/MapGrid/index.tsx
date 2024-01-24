import React, { useEffect, useRef } from "react"

interface Props {
    width: number;
    height: number;
}
const MapGrid = ({ width, height }: Props) => {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const gridGap = 10;

        if(!canvas) return;

        const context = canvas.getContext("2d");

        if(!context) return;

        for (let x = 0; x < width; x += gridGap) {
            context.moveTo(0.5 + x + gridGap, 0);
            context.lineTo(0.5 + x + gridGap, height + gridGap);
        }
    
        for (let x = 0; x < height; x += gridGap) {
            context.moveTo(0, 0.5 + x + gridGap);
            context.lineTo(width + gridGap, 0.5 + x + gridGap);
        }
        context.strokeStyle = "#bbb";
        context.stroke();
    }, [ref.current])

    return <canvas ref={ref} width={width} height={height}>
        
    </canvas>
}

export { MapGrid }