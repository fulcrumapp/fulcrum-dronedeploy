import React from 'react';
import { Redirect } from 'react-router-dom';

require('./SignOut.css');

export default class SignOut extends React.Component {
  static propTypes = {
    onSignedOut: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.onSignedOut();
  }

  render() {
    return (
      <Redirect to="/annotations" />
    );
  }
}
