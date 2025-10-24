import { NavLink, Outlet } from "react-router";
import { useEffect, useState } from "react";

import profile_icon from "./profile.svg"
import home_icon from "./home.svg"
import history_icon from "./history.svg"
import sun_icon from "./sun.svg"
import moon_icon from "./moon.svg"
import shrink_icon from "./shrink.svg"
import expand_icon from "./expand.svg"

import "./layout.css"

function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
        <img onClick={() => setTheme(theme === "light" ? "dark" : "light")} src={theme === "light" ? moon_icon : sun_icon}/>
  );
}

export default function MainLayout() {
    const [isShrinked, setIsShrinked] = useState(false);

    return (
        <div className="layout">
            <div>
                <div className={"navbar" + " " + (isShrinked ? "shrinked" : undefined)}>
                    {!isShrinked ?
                        <>
                            <div className="links">
                                <NavLink to="/"><img src={home_icon}/>Home Page</NavLink>
                                <NavLink to="/history"><img src={history_icon}/>History</NavLink>
                                <NavLink to="/profile"><img src={profile_icon}/>Profile</NavLink>
                            </div>
                            <ThemeToggle />
                            <img onClick={() => setIsShrinked(!isShrinked)} src={isShrinked? expand_icon : shrink_icon}/>
                        </>
                    :   
                    <>
                        <div className="links"> 
                            <NavLink to="/"><img src={home_icon}/></NavLink>
                            <NavLink to="/history"><img src={history_icon}/></NavLink>
                            <NavLink to="/profile"><img src={profile_icon}/></NavLink>
                        </div>
                        <ThemeToggle />
                        <img onClick={() => setIsShrinked(!isShrinked)} src={isShrinked? expand_icon : shrink_icon}/>
                    </>
                    }
                </div>
            </div>

            <main>
                <Outlet />
            </main>

            <footer>
                Some footer content
            </footer>
        </div>
    )
}