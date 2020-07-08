import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./containers/Home/Home";
import NotFound from "./containers/NotFound/NotFound";
import Login from "./containers/Login/Login";
import SignUp from "./containers/SignUp/SignUp";
import NewNote from "./containers/NewNote/NewNote";
import Notes from "./containers/Notes/Notes";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute/UnauthenticatedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute/AuthenticatedRoute";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <UnauthenticatedRoute exact path="/login" />
        <Login />
      <UnauthenticatedRoute />
      <UnauthenticatedRoute exact path="/signup" />
        <SignUp />
      <UnauthenticatedRoute />
      <AuthenticatedRoute exact path="/notes/new">
        <NewNote />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/notes/:id">
        <Notes />
      </AuthenticatedRoute>
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
