import React, { Component, useEffect, useState } from 'react';
import type { ForceGraphProps } from 'react-force-graph-2d';
import "./Graph.css"

function Graph({ graphData }: ForceGraphProps) {
    const [ForceGraph2D, setForceGraph2D] = useState<any>(null);

    useEffect(() => {
        import("react-force-graph-2d").then((mod) => setForceGraph2D(() => mod.default));
    }, []);
    if (!ForceGraph2D) {
        return (
            <div className='graph-container'>
                Loading...
            </div>
        )
    } else {
        return (
        <div className='graph-container'>
                <ForceGraph2D
                    graphData={graphData}
                    width={500}
                    height={150}
                />
            </div>
        );
    }
    
}

export default Graph;