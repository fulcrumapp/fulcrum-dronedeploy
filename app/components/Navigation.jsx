import React from 'react';
import { Link } from 'react-router-dom';

require('./Navigation.css');

export default class Navigation extends React.Component {
  static propTypes = {
    backPath: React.PropTypes.string
  }

  render() {
    const backPath = this.props.backPath || '/annotations';

    return (
      <div className="navigation">
        <hr />
        <div className="row">
          <Link
            to={backPath}
            className="button back">
            &lt; back
          </Link>
        </div>
      </div>
    );
  }
}
