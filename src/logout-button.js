import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  //const { logout } = useAuth0();
  const { user, isAuthenticated, logout } = useAuth0();

  if(!isAuthenticated) {
      return(
          <span></span>
      )
  }
  else {

    return (
      <span className="m-lg-2">
        {user.email}
        <button className="btn btn-warning m-lg-2" onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
      </span>
    )
  
  }
}

export default LogoutButton