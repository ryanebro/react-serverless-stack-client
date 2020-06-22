import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./containers/Home/Home";
import NotFound from "./containers/NotFound/NotFound";
import Login from "./containers/Login/Login";
import SignUp from "./containers/SignUp/SignUp";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={SignUp} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default Routes;