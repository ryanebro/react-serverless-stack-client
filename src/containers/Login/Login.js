import React, { useState } from 'react';
import { Auth } from "aws-amplify";
import { useHistory } from 'react-router-dom';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

import { useAppContext } from '../../libs/contextLib';
import LoaderButton from '../../components/LoaderButton/LoaderButton';
import { onError } from '../../libs/errorLib';

import './login.scss';

const Login = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    // This is telling React that we want to use our app context here and that we want to be able to use the userHasAuthenticated function.
    const {userHasAuthenticated} = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function validateForm() {
        return email.length > 0 && email.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        try {
            await Auth.signIn(email, password);
            console.log('user logged in');
            userHasAuthenticated(true);
            history.push('/');
        } catch(error) {
            onError(error);
            setIsLoading(false);
        }
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="email" bsSize="large">
                <ControlLabel>Email</ControlLabel>
                <FormControl
                    autoFocus
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    type="email"
                />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    type="password"
                />
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    disabled={!validateForm()}
                    type="submit"
                    isLoading={isLoading}>
                Login
                </LoaderButton>
            </form>
        </div>
    )
}

export default Login;