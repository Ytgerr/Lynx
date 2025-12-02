import React, { type PropsWithChildren, type ReactNode } from "react";
import Graph from "../Graph/Graph";
import "./RelationalCard.css"
import type { GraphData  } from "react-force-graph-2d";

type RelationalCardProps = {
    title: string;
    graphData: GraphData;
    saveCard?: (graphData: GraphData, text: string) => void;
    text: string;
}

export function RelationalCard({ title, graphData, saveCard, text }: RelationalCardProps): React.ReactElement {

    return (
        <fieldset className="rel-card">
            <legend><h3>{title}</h3></legend>
            <div className="rel-card-text-wrapper">
                <div className="rel-card-text"><p>{text}</p></div>
            </div>
            <div className="rel-card-graph-wrapper">
                <Graph graphData={graphData}/>
            </div>
            {saveCard &&
                <button  onClick={() => saveCard(graphData, text)} className="save-rel-card-button">
                    <span>Save Card</span>
                </button>
            }
            
        </fieldset>
    );
}