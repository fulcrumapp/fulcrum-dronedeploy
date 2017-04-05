import React from 'react';
import { Link } from 'react-router-dom';

require('./Navigation.css');

export default class Navigation extends React.Component {
  render() {
    return (
      <div className="navigation">
        <hr />
        <div className="row">
          <Link
            to="/expanded"
            className="button back">
            ← back
          </Link>
        </div>
      </div>
    );
  }
}