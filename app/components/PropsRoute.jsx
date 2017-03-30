import React from 'react';
import { Route } from 'react-router-dom';

import { renderMergedProps } from '../utils';

export default function PropsRoute({ component, ...rest }) {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return renderMergedProps(component, routeProps, rest);
      }} />
  );
}
