import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useAppContext} from '../../libs/contextLib';

const UnauthenticatedRoute = ({children, ...rest}) => {
    const {isAuthenticated} = useAppContext();

    return (
        <Route {...rest}>
            {
                !isAuthenticated ? (
                    children
                ) : (
                    <Redirect to="/" />
                )
            }
        </Route>
    );
}

export default UnauthenticatedRoute;