import React, { useState } from 'react';
import { Auth } from "aws-amplify";
import { useHistory } from 'react-router-dom';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

import { useAppContext } from '../../libs/contextLib';
import { useFormFields } from '../../libs/hooksLib';
import LoaderButton from '../../components/LoaderButton/LoaderButton';
import { onError } from '../../libs/errorLib';

import './login.scss';

const Login = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    // This is telling React that we want to use our app context here and that we want to be able to use the userHasAuthenticated function.
    const {userHasAuthenticated} = useAppContext();
    const [fields, handleFieldChange] = useFormFields({
        email: '',
        password: ''
    })

    function validateForm() {
        return fields.email.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        try {
            await Auth.signIn(fields.email, fields.password);
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
                    value={fields.email}
                    onChange={handleFieldChange}
                    type="email"
                />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl
                    value={fields.password}
                    onChange={handleFieldChange}
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