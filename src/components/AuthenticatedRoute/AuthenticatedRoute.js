import React from 'react';
import {Route, Redirect, useLocation} from "react-router-dom";
import {useAppContext} from '../../libs/contextLib';

const AuthenticatedRoute = ({children, ...rest}) => {
    const {pathname, search} = useLocation();
    const {isAuthenticated} = useAppContext();

    // creates a route where the children are rendered only if the user is authenticated. if not user is redirected to the login page
    return (
        <Route {...rest}>
            {
                isAuthenticated ? (
                    children
                ) : (
                    <Redirect to={`/login?redirect=${pathname}${search}`}/>
                )
            }
        </Route>
    );
}

export default AuthenticatedRoute;