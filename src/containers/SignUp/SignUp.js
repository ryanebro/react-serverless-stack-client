import React, {useState} from 'react';
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";

import LoaderButton from "../../components/LoaderButton/LoaderButton";
import { useAppContext } from "../../libs/contextLib";
import { useFormFields } from "../../libs/hooksLib";
import { onError } from "../../libs/errorLib";

import './signup.scss';

const SignUp = () => {
    const [fields, handleFieldChange] = useFormFields({
        email: '',
        password: '',
        confirmPassword: '',
        confirmationCode: ''
    })
    const history = useHistory();
    const [newUser, setNewUser] = useState(null);
    const {userHasAuthenticated} = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        try {
            // create new user and save to state via setNewUser
            const newUser = await Auth.signUp({
                username: fields.email,
                password: fields.password
            })
            setIsLoading(false);
            setNewUser(newUser);
        } catch(error) {
            // TODO: If the user refreshes their page at the confirm step, they won’t be able to get back and confirm that account. https://serverless-stack.com/chapters/signup-with-aws-cognito.html
            onError(error);
            setIsLoading(false);
        }
    }

    async function handleConfirmationSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        try {
            await Auth.confirmSignUp(fields.email, fields.confirmationCode);
            await Auth.signIn(fields.email, fields.password);

            userHasAuthenticated(true);
            history.push('/');
        } catch (error) {
            onError(error);
            setIsLoading(false);
        }
    }

    function renderConfirmationForm() {
        return (
            <form onSubmit={handleConfirmationSubmit}>
                <FormGroup controlId="confirmationCode" bsSize="large">
                <ControlLabel>Confirmation Code</ControlLabel>
                <FormControl
                    autoFocus
                    type="tel"
                    onChange={handleFieldChange}
                    value={fields.confirmationCode}
                />
                <HelpBlock>Please check your email for the code.</HelpBlock>
                </FormGroup>
                <LoaderButton
                block
                type="submit"
                bsSize="large"
                isLoading={isLoading}
                disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
            </form>
        )
    }

    function renderForm() {
        return (
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="email" bsSize="large">
                <ControlLabel>Email</ControlLabel>
                <FormControl
                    autoFocus
                    type="email"
                    value={fields.email}
                    onChange={handleFieldChange}
                />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl
                    type="password"
                    value={fields.password}
                    onChange={handleFieldChange}
                />
                </FormGroup>
                <FormGroup controlId="confirmPassword" bsSize="large">
                <ControlLabel>Confirm Password</ControlLabel>
                <FormControl
                    type="password"
                    onChange={handleFieldChange}
                    value={fields.confirmPassword}
                />
                </FormGroup>
                <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
            </form>
        )
    }

    return (
        <div className="SignUp">
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </div>
    );
}

export default SignUp;