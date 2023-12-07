import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";

function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="navbar">
      <div className="profile-button">
        <ul className="profile-button-items">
          <li>
            <NavLink exact="true" to="/">
              Home
            </NavLink>
          </li>
          <li>
            <ProfileButton />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navigation;
