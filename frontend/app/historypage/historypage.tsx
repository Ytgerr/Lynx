import { RelationalCard } from "~/components/RelationalCard/RelationalCard";
import { useCardsHistoryContext } from "~/contexts/CardsHistoryContext";

import './historypage.css'

function HistoryPage() {

    const {cardsHistory: userGraphsData, saveCard} = useCardsHistoryContext();

    return ( 
        <div className="historypage">
            <span className="subtitle">
                Saved Graphs!
            </span>
            {userGraphsData.map((item, index) => {
                return <RelationalCard key={index} title={item.text.split(' ').slice(0, 2).join(' ')} graphData={item.graphData} text={item.text}></RelationalCard>
            })}
        </div>
     );
}

export default HistoryPage;