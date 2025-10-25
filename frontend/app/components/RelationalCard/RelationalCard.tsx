import React, { type PropsWithChildren } from "react";
import Graph from "../Graph/Graph";
import "./RelationalCard.css"

type RelationalCardProps = {
    title: string;
}

export function RelationalCard({ title, children }: PropsWithChildren<RelationalCardProps>): React.ReactElement {

    return (
        <fieldset className="rel-card">
            <legend>{title}</legend>
            <div className="rel-card-text-wrapper">
                <div className="rel-card-text">{children}</div>
            </div>
            <Graph />
        </fieldset>
    );
}