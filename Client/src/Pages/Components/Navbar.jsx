import { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const UniqueNavbar = () => {
  const [showSidebar, setSidebar] = useState(false);

  return (
    <>
      <div className="navbar-unique" id="UniqueNavbar">
        <div className="navdiv-unique">
          <div className="logo-unique">
            <Link to={"/"}>LegalMind</Link>
          </div>
          <div className="nav-items-unique hideonPhone-unique">
            <ul className="navul-unique">
              <li className="navli-unique">
                <Link to={"/Dashboard"}>Dashboard</Link>
              </li>
              <li className="navli-unique">
                <a href="#obj">About Us</a>
              </li>
              <li className="navli-unique">
                <a href="#contact">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="auth-buttons-unique hideonPhone-unique">
            <Link to={"/UserLogin"}>
              <button className="button-unique">Login</button>
            </Link>
            <Link to={"/UserRegistration"}>
              <button className="button-unique">SignUp</button>
            </Link>
          </div>
          {!showSidebar ? (
            <FiMenu
              className="menuicon-unique"
              size={"25px"}
              onClick={() => setSidebar(true)}
            />
          ) : (
            <IoClose
              className="menuicon-unique"
              color="white"
              size={"23px"}
              onClick={() => setSidebar(false)}
            />
          )}
        </div>
      </div>

      {showSidebar && (
        <div className="sidebarNav-unique">
          <ul>
            <li>
              <Link to={"/home"}>Home</Link>
            </li>
            <li>
              <Link to={"/"}>About us</Link>
            </li>
            <li>
              <Link to={"/"}>Contact us</Link>
            </li>
            <li>
              <Link to={"/logsign"}>Login/Signup</Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default UniqueNavbar;
