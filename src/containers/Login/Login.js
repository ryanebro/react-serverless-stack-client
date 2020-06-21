import React, { useState } from 'react';
import { Auth } from "aws-amplify";
import { useHistory } from 'react-router-dom';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

import { useAppContext } from '../../libs/contextLib';

import './login.scss';

const Login = () => {
    const history = useHistory();
    // This is telling React that we want to use our app context here and that we want to be able to use the userHasAuthenticated function.
    const {userHasAuthenticated} = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function validateForm() {
        return email.length > 0 && email.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            await Auth.signIn(email, password);
            console.log('user logged in');
            userHasAuthenticated(true);
            history.push('/');
        } catch {
            alert(event.message);
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
                <Button
                    block
                    bsSize="large"
                    disabled={!validateForm()}
                    type="submit">
                Login
                </Button>
            </form>
        </div>
    )
}

export default Login;