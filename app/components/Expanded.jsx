import React from 'react';
import { Link } from 'react-router-dom';

require('./Expanded.css');

export default class Expanded extends React.Component {
  static propTypes = {
    signedIn: React.PropTypes.bool.isRequired
  }

  render() {
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
              Sign Out of Fulcrum
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="row">
        <Link
          className="button"
          to="/sign-in">
          Sign In
        </Link>
      </div>
    );
  }
}
