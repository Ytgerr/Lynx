import { RelationalCard } from "~/components/RelationalCard/RelationalCard";
import type { GraphData } from "react-force-graph-2d";
import "./homepage.css"

export function HomePage() {
  const graphBaselineData: GraphData = {
    nodes: [
      {
        "id": 1,
        "name": "Susanna",
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
}
