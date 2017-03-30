import React from 'react';

export function renderMergedProps(component, ...rest) {
  const finalProps = Object.assign({}, ...rest);

  return (
    React.createElement(component, finalProps)
  );
}
