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

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/ml/entity-recognition_ru", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "text": "Владимир Путин немного подумав, как сообщил он, купил так давно желаемую Америку"
          })
        }
      )

      const data = await res.json()
      const combinedDatas = reformData(data)
      console.log(combinedDatas)

      setMainGraphData(combinedDatas)
    }

    fetchData()
  }, [])

  const graphBaselineData: GraphData = {
    nodes: [
      {
        id: 1,
        name: "Susanna",
        "val": 2,
        "color": "red"
      },
      {
        "id": 2,
        "name": "Jerry",
        "val": 7,
        "color": "green"
      },
      {
        "id": 3,
        "name": "Shmabulok",
        "val": 4
      }
    ],
    links: [
      {
        "source": 1,
        "target": 2
      },
      {
        "source": 3,
        "target": 2
      },
      {
        "source": 2,
        "target": 2
      }
    ]
  }

  if (mainGraphData) {
    return (
      <>
        <div className="rel-cards">
          <RelationalCard title="Lorem Ipsum" graphData={mainGraphData}>
            <p>Владимир Путин немного подумав, как сообщил он, купил так давно желаемую Америку</p>
          </RelationalCard>
        </div>
      </>
    )
    
  } else {
    return(
      <>
        Загрузка...
      </>
    )
  }
}
