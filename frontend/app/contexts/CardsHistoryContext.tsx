import React, { useContext, type ReactNode } from "react";
import type { GraphData } from "react-force-graph-2d";

type CardsHistoryContextType = 
    {
        cardsHistory: {
            graphData: GraphData,
            text: string
        }[],
        saveCard: (graphData: GraphData, text: string) => void
    }

const CardsHistoryContext = React.createContext<CardsHistoryContextType>({
    cardsHistory: [],
    saveCard: () => {}
});

function CardsHistoryContextProvider({ children }: { children: ReactNode }): React.ReactElement {

    const [cardsHistory, setCardsHistory] = React.useState<{
            graphData: GraphData,
            text: string
        }[]>([]);

    function saveCardToHistory(graphData: GraphData, text: string) {
        setCardsHistory([...cardsHistory, {graphData: graphData, text: text}]);
        
    }

    return (
        <CardsHistoryContext.Provider value={{cardsHistory: cardsHistory, saveCard: saveCardToHistory}}>
            {children}
        </CardsHistoryContext.Provider>
    );
}

export function useCardsHistoryContext() {
    return useContext(CardsHistoryContext);
}
export default CardsHistoryContextProvider;