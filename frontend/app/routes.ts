import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    layout("layout/layout.tsx", [
        index("./routes/home.tsx"),
        route("history", "./routes/history.tsx")
    ])
] satisfies RouteConfig;
