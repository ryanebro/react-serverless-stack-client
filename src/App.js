import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import Routes from './Routes';
import { AppContext } from './libs/contextLib';

import './app.scss'

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, []); // [] check the user’s authentication state when our app first loads

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch(error) {
      if (error !== 'No current user') {
        alert(error);
      }
    }
    setIsAuthenticating(false);
  }

  function handleLogout() {
    userHasAuthenticated(false);
  }

  return (
    !isAuthenticating &&
    <div className="App container">
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Scratch</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {
              isAuthenticated
              ? <NavItem onClick={handleLogout}>Logout</NavItem>
              : <>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* AppContext Provider: all the child components inside the Context Provider should be able to access what we put in it */}
      <AppContext.Provider value={{isAuthenticated, userHasAuthenticated}}>
        <Routes />
      </AppContext.Provider>
    </div>
  );
}

export default App;
