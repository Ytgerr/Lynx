import { NavLink, Outlet } from "react-router";
import { useEffect, useState } from "react";

import profile_icon from "./assets/profile.svg"
import home_icon from "./assets/home.svg"
import history_icon from "./assets/history.svg"
import sun_icon from "./assets/sun.svg"
import moon_icon from "./assets/moon.svg"
import shrink_icon from "./assets/shrink.svg"
import expand_icon from "./assets/expand.svg"

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
    const [isAbsolute, setIsAbsolute] = useState(false);

    const shrinkLayout = () => {
        setIsShrinked(!isShrinked);
        if (isAbsolute) {
            setIsAbsolute(!isAbsolute);
        } else {
            setTimeout(() => {setIsAbsolute(!isAbsolute)}, 300);
        }
    }

    return (
        <div className="layout">
            <div className="navbar-wrapper">
                <div className={"navbar" + " " + (isShrinked ? "shrinked" : undefined)}>
                    {!isShrinked ?
                        <>
                            <div 
                                className="links"
                            >
                                <NavLink to="/"><img src={home_icon}/>Home Page</NavLink>
                                <NavLink to="/history"><img src={history_icon}/>History</NavLink>
                                <NavLink to="/profile"><img src={profile_icon}/>Profile</NavLink>
                            </div>
                            <ThemeToggle />
                            <img onClick={shrinkLayout} src={isShrinked? expand_icon : shrink_icon}/>
                        </> 
                    :   
                    <>
                        <div className="links"> 
                            <NavLink to="/"><img src={home_icon}/></NavLink>
                            <NavLink to="/history"><img src={history_icon}/></NavLink>
                            <NavLink to="/profile"><img src={profile_icon}/></NavLink>
                        </div>
                        <ThemeToggle />
                        <img onClick={shrinkLayout} src={isShrinked? expand_icon : shrink_icon}/>
                    </>
                    }
                </div>
            </div>
            
            <main
                className={isAbsolute? "main-full" : "main-shifted"}
            >
                <Outlet />
            </main>

            <footer>
                Some footer content
            </footer>
        </div>
    )
}