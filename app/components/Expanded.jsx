import React from 'react';
import { Link } from 'react-router-dom';

import { urlRoot } from '../constants';

require('./Expanded.css');

export default class Expanded extends React.Component {
  static propTypes = {
    signedIn: React.PropTypes.bool.isRequired
  }

  render() {
    const signInPath = `${urlRoot}sign-in`;

    if (this.props.signedIn) {
      return (
        <div>
          <div className="row">
            <Link
              className="button"
              to="/annotations">
              Annotations
            </Link>
          </div>
          <div className="row">
            <Link
              className="button"
              to="/sign-out">
              Sign Out
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="row">
        <Link
          className="button"
          to={signInPath}>
          Sign In
        </Link>
      </div>
    );
  }
}
