import { RelationalCard } from "~/components/RelationalCard/RelationalCard";
import type { GraphData } from "react-force-graph-2d";
import "./homepage.css"
import { useEffect, useState } from "react";
<<<<<<< HEAD
=======

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
>>>>>>> c13c213 (added integration with ml)

<<<<<<< HEAD
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

      setMainGraphData(combinedDatas)
    }

    fetchData("Владимир Путин немного подумав, как сообщил он, купил так давно желаемую Америку")
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
        
      </div>
    </div>
  )
=======
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

<<<<<<< HEAD
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

<<<<<<< HEAD
  return (
    <>
      <div className="rel-cards">
        <RelationalCard title="Lorem Ipsum" graphData={graphBaselineData}>
          <>Voluptatem similique quibusdam dolorem! Magni debitis assumenda harum tempore, non laboriosam consequatur nihil perspiciatis sit minus ut!</>
          <p>Nulla ut deserunt recusandae consectetur exercitationem. Tempore, id tempora doloribus nostrum odit fugiat delectus accusantium repudiandae numquam sapiente quo consectetur quasi dolores error modi reprehenderit consequatur harum iusto odio maiores!</p>
        </RelationalCard>
        {/* <RelationalCard title="Magni debitis" graphData={graphBaselineData}>
          <>Consequatur nihil perspiciatis sit minus ut!</>
          <p>Nulla ut deserunt recusandae consectetur exercitationem. Tempore, id tempora doloribus nostrum odit fugiat delectus accusantium repudiandae numquam sapiente quo consectetur quasi dolores error modi reprehenderit consequatur harum iusto odio maiores!</p>
        </RelationalCard>
        <RelationalCard title="Tempore" graphData={graphBaselineData}>
          <>Sit amet consectetur adipisicing elit. Magni ratione totam aliquam saepe. Voluptatem similique quibusdam dolorem! Magni debitis assumenda harum tempore, non laboriosam consequatur nihil perspiciatis sit minus ut!</>
          <p>Nulla ut deserunt recusandae consectetur exercitationem. Tempore, id tempora doloribus nostrum odit fugiat delectus accusantium repudiandae numquam sapiente quo consectetur quasi dolores error modi reprehenderit consequatur harum iusto odio maiores!</p>
        </RelationalCard>
        <RelationalCard title="Lorem Ipsum" graphData={graphBaselineData}>
          <>Aliquam saepe. Voluptatem similique quibusdam dolorem! Magni debitis assumenda harum tempore, non laboriosam consequatur nihil perspiciatis sit minus ut!</>
          <p>Nulla ut deserunt recusandae consectetur exercitationem. Tempore, id tempora doloribus nostrum odit fugiat delectus accusantium repudiandae numquam sapiente quo consectetur quasi dolores error modi reprehenderit consequatur harum iusto odio maiores!</p>
        </RelationalCard>
        <RelationalCard title="Nulla ut deserunt" graphData={graphBaselineData}>
          <>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni ratione totam aliquam saepe. Voluptatem similique quibusdam dolorem! Magni debitis assumenda harum tempore, non laboriosam consequatur nihil perspiciatis sit minus ut!</>
          <p>Nulla ut deserunt recusandae consectetur exercitationem. Tempore, id tempora doloribus nostrum odit fugiat delectus accusantium repudiandae numquam sapiente quo consectetur quasi dolores error modi reprehenderit consequatur harum iusto odio maiores!</p>
        </RelationalCard> */}
      </div>
    </>
  );
>>>>>>> 1d43d30 (ForceGraph Integrated)
=======
=======
>>>>>>> 6bfef5b (ForceGraph Integrated)
  if (mainGraphData) {
    return (
      <div className="homepage">
        <div className="rel-cards">
          <RelationalCard title="Lorem Ipsum" graphData={mainGraphData}>
            <p>Владимир Путин немного подумав, как сообщил он, купил так давно желаемую Америку</p>
          </RelationalCard>
        </div>
      </div>
    )
  }
>>>>>>> c13c213 (added integration with ml)
}
