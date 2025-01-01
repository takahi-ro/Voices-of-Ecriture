'use client';
import dynamic from "next/dynamic";
const Sketch = dynamic(() => import("./sketch"), { ssr: false });

export const SketchWrapper = () => {
    return (
        <Sketch />
    );
};