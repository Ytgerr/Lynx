import React, { type PropsWithChildren } from "react";
import Graph from "../Graph/Graph";
import "./RelationalCard.css"
import type { GraphData  } from "react-force-graph-2d";

type RelationalCardProps = {
    title: string;
    graphData: GraphData ;
}

export function RelationalCard({ title, graphData, children }: PropsWithChildren<RelationalCardProps>): React.ReactElement {

    return (
        <fieldset className="rel-card">
            <legend><h3>{title}</h3></legend>
            <div className="rel-card-text-wrapper">
                <div className="rel-card-text">{children}</div>
            </div>
            <Graph graphData={graphData}/>
        </fieldset>
    );
}