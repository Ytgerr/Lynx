import { RelationalCard } from "~/components/RelationalCard/RelationalCard";
import type { GraphData } from "react-force-graph-2d";
import "./homepage.css"
import { useEffect, useState } from "react";

type ML_Message = {
  results: [
    {
      sentence: string,
      entities: [{
        text: string,
        type: string,
        start: number,
        stop: number
      }],
      relations: [
        {
          subject: string,
          subject_type: string,
          relation: string,
          relation_type: string,
          object: string,
          object_type: string,
          sentence: string
        },
      ]
    }
  ]
}

export function HomePage() {

  const [mainGraphData, setMainGraphData] = useState<GraphData>();
  const [userGraphsData, setUserGraphsData] = useState<{graphData: GraphData, text: string}[]>([]);
  const [inputValue, setInputValue] = useState<string>();
  const [language, setLanguage] = useState<string>("ru");

  function reformData( data: ML_Message ) {
    let combinedDatas: GraphData = {nodes: [], links: []};

    data.results.forEach(element => {
      element.relations.forEach((relation, index) => {
        combinedDatas.nodes.push({
          id: relation.object + relation.relation + index,
          name: relation.object,
          val: 1
        })

        combinedDatas.nodes.push({
          id: relation.subject + relation.relation + index,
          name: relation.subject,
          val: 1
        })

        combinedDatas.links.push({
          source: relation.object + relation.relation + index,
          target: relation.subject + relation.relation + index,
          label: relation.relation
        })
      })
    });

    return combinedDatas
  }

  const fetchData = async (text_query: string) => {
    console.log(text_query)
    const res = await fetch("/ml/entity-recognition_ru", 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "text": text_query
        })
      }
    )

    const data = await res.json()
    const combinedDatas = reformData(data)
    console.log(combinedDatas)

    return combinedDatas
  }

  useEffect(() => {
    (async () => {
      setMainGraphData(await fetchData("Владимир Путин немного подумав, как сообщил он, купил так давно желаемую Америку"))
    })();
    
  }, [])

  return (
    <div className="homepage">
      <div className="logo-and-desc">
        <div className="logo">
          Lynx
        </div>

        <div className="desc">
          Transform dense articles into intuitive knowledge graphs, instantly revealing the hidden connections between people, companies, and ideas. Unlock deeper insights and spot critical relationships at a glance, turning complex information into a clear, actionable visual map.
        </div>
      </div>
      <div className="rel-cards">
        <span className="subtitle">
          Example:
        </span>
        {mainGraphData? 
        <RelationalCard title="Lorem Ipsum" graphData={mainGraphData}>
          <p>Владимир Путин немного подумав, как сообщил он, купил так давно желаемую Америку</p>
        </RelationalCard>
        :
        <></>}
        <span className="subtitle">
          Make your own relation graphs!
        </span>
        {userGraphsData.map((item, index) => {
          return <RelationalCard key={index} title="Lorem Ipsum" graphData={item.graphData}><p>{item.text}</p></RelationalCard>
        })}
        
        <div className="add-container">
          <textarea className="user-phrase-input" value={inputValue} onChange={e => {setInputValue(e.target.value)}}/>
          <div className="buttons-block">

            <div className="language-choice">
              Language: 
              <span className="lang-dropdown">
                <span>{language}</span>
                <div className="lang-dropdown-choices">
                  <div onClick={() => setLanguage("ru")}>ru</div>
                  <div onClick={() => setLanguage("eng")}>eng</div>
                </div>
              </span>
            </div>

            <button onClick={async () => {
              if (inputValue) {
                const result = await fetchData(inputValue);
                setUserGraphsData(prev => [...prev, {graphData:result, text:inputValue}]);
                setInputValue("")
              }
            }}>ReGraph!</button>

            
          </div>
          
        </div>
      </div>
    </div>
  )
}
