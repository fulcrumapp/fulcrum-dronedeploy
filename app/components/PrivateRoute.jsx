import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { renderMergedProps } from '../utils';

export default function PrivateRoute({ component, redirectTo, ...rest }) {
  return (
    <Route {...rest} render={routeProps => {
      return rest.signedIn ? (
        renderMergedProps(component, routeProps, rest)
      ) : (
        <Redirect to={{
          pathname: redirectTo,
          state: { from: routeProps.location }
        }} />
      );
    }} />
  );
}
