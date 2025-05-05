import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const AuthGuard = ({ component: Component, ...rest }) => {
    const isAuthenticated = true; // Remplacez par votre logique d'authentification

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};
