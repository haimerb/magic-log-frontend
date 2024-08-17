import React from "react";
//import { withRouter } from "react-router-dom";
import {withRouter} from "./ComponentWithRouterProp";
import { Login } from "@mui/icons-material";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const AuthVerify = (props) => {
  props.history.listen(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      const decodedJwt = parseJwt(user.accessToken);

      if (decodedJwt.exp * 1000 < Date.now()) {
        props.logOut();
      }
    }
  });

  return (<div><Login></Login></div>);
};

export default withRouter(AuthVerify);
