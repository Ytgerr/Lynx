import React, { Component } from 'react';
import "./Graph.css"

class Graph extends Component {
    render() {
        return (
            <div className='graph-container'>
                <div className="circle" style={{backgroundColor: "red"}}>C</div>
                <div> {"------>"} </div>
                <div className="circle" style={{backgroundColor: "blue"}}>B</div>
            </div>
        );
    }
}

export default Graph;